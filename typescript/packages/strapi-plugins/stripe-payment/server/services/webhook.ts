import Stripe from 'stripe'
import { Strapi } from '@strapi/strapi'
import createHttpError from 'http-errors'

import { BillingReason, PaymentMode, PaymentTransactionStatus, StripeEventType, SubscriptionStatus } from '../enums'
import { Plan } from '../interfaces'

export default ({ strapi }: { strapi: Strapi }) => ({
  async handleEvent(event: Stripe.Event) {
    switch (event.type) {
      case StripeEventType.CheckoutSessionCompleted:
        await this.handleCheckoutSessionCompleted(event)
        break
      case StripeEventType.InvoicePaymentSucceeded:
        await this.handleInvoicePaymentSucceeded(event)
        break
      case StripeEventType.InvoicePaymentFailed:
        await this.handleInvoicePaymentFailed(event)
        break
      case StripeEventType.CustomerSubscriptionUpdated:
        await this.handleSubscriptionUpdated(event)
        break
      case StripeEventType.PaymentMethodAttached:
        await this.handlePaymentMethodAttached(event)
        break
      case StripeEventType.PriceDeleted:
        await this.handlePriceDeleted(event)
        break
      case StripeEventType.PriceUpdated:
        await this.handlePriceUpdated(event)
        break
      case StripeEventType.PriceCreated:
        await this.handlePriceCreated(event)
        break
      case StripeEventType.ProductCreated:
        await this.handleProductCreated(event)
        break
      case StripeEventType.ProductUpdated:
        await this.handleProductUpdated(event)
        break
      case StripeEventType.ProductDeleted:
        await this.handleProductDeleted(event)
        break
      case StripeEventType.SetupIntentSucceeded:
        await this.handleSetupIntentSucceeded(event)
        break
      default:
        break
    }
  },

  async handleCheckoutSessionCompleted(event: Stripe.CheckoutSessionCompletedEvent) {
    const checkoutSession = event.data.object
    if (checkoutSession.mode === PaymentMode.Setup) {
      return
    }

    try {
      const { metadata } = checkoutSession

      if (!metadata?.organizationName || !metadata?.userId || !metadata?.planId || !metadata?.quantity) {
        throw new createHttpError.BadRequest('Metadata is missing required fields')
      }

      const { organizationName, userId, planId, quantity } = metadata
      const isSubscription = checkoutSession.mode === PaymentMode.Subscription
      const stripeCustomerId = checkoutSession.customer
      const stripeSubscriptionId = checkoutSession.subscription
      const stripeInvoiceId = checkoutSession.invoice
      const stripePaymentIntentId = checkoutSession.payment_intent

      let stripeCustomer
      let stripeTransaction

      if (isSubscription) {
        stripeTransaction = await strapi.plugin('stripe-payment').service('stripe').invoices.retrieve(stripeInvoiceId)
      } else {
        stripeTransaction = await strapi
          .plugin('stripe-payment')
          .service('stripe')
          .paymentIntents.retrieve(stripePaymentIntentId)
      }

      const paymentTransaction = await strapi.query('plugin::stripe-payment.transaction').create({
        data: {
          status: PaymentTransactionStatus.COMPLETED,
          externalTransaction: stripeTransaction
        }
      })
      let organization = await strapi.query('plugin::stripe-payment.organization').findOne({
        where: stripeCustomerId ? { customer_id: stripeCustomerId } : { name: organizationName },
        populate: {
          subscription: true,
          transactions: true,
          purchases: true
        }
      })

      if (!organization) {
        if (!stripeCustomerId) {
          const owner = await strapi.query('plugin::users-permissions.user').findOne({ where: { id: userId } })

          stripeCustomer = await strapi.plugin('stripe-payment').service('stripe').customers.create({
            name: organizationName,
            email: owner.email
          })
        }

        organization = await strapi.query('plugin::stripe-payment.organization').create({
          data: {
            name: organizationName,
            customer_id: stripeCustomer?.id ?? stripeCustomerId,
            owner_id: userId,
            users: [userId],
            quantity: parseInt(quantity, 10)
          }
        })
      } else {
        organization = await strapi.query('plugin::stripe-payment.organization').update({
          where: { id: organization.id },
          data: {
            name: organizationName,
            owner_id: userId,
            users: [userId],
            quantity: parseInt(quantity, 10)
          }
        })
      }

      if (isSubscription) {
        const subscription = await strapi.query('plugin::stripe-payment.subscription').create({
          data: {
            status: SubscriptionStatus.TRIALING,
            stripe_id: stripeSubscriptionId,
            organization: organization.id,
            plan: planId
          }
        })

        await strapi.query('plugin::stripe-payment.organization').update({
          where: { id: organization.id },
          data: {
            subscription: subscription.id,
            transactions: organization.transactions
              ? [...organization.transactions, paymentTransaction.id]
              : [paymentTransaction.id]
          }
        })

        await strapi.query('plugin::stripe-payment.transaction').update({
          where: { id: paymentTransaction.id },
          data: {
            subscriptionId: subscription.id,
            organization: organization.id
          }
        })
      } else {
        const purchase = await strapi.query('plugin::stripe-payment.purchase').create({
          data: {
            plan: planId,
            organization: organization.id,
            stripe_id: stripeTransaction.id
          }
        })

        console.log(purchase)

        await strapi.query('plugin::stripe-payment.organization').update({
          where: { id: organization.id },
          data: {
            purchases: organization.purchases ? [...organization.purchases, purchase.id] : [purchase.id],
            transactions: organization.transactions
              ? [...organization.transactions, paymentTransaction.id]
              : [paymentTransaction.id]
          }
        })

        await strapi.query('plugin::stripe-payment.transaction').update({
          where: { id: paymentTransaction.id },
          data: {
            purchaseId: purchase.id,
            organization: organization.id
          }
        })
      }
    } catch (e) {
      console.error(e)
      throw new Error('Could not create subscription or organization')
    }
  },

  async handleInvoicePaymentSucceeded(event: Stripe.InvoicePaymentSucceededEvent) {
    if (event.data.object.billing_reason === BillingReason.Subscription_create) {
      return null
    }

    const subscription = await strapi.query('plugin::stripe-payment.subscription').findOne({
      where: {
        stripe_id: event.data.object.subscription
      },
      populate: {
        organization: true
      }
    })

    if (!subscription) {
      throw new createHttpError.NotFound(`Subscription with stripe id ${event.data.object.subscription} are not found`)
    }

    if (subscription.status === SubscriptionStatus.ACTIVE) {
      return subscription
    }

    await strapi.query('plugin::stripe-payment.transaction').create({
      data: {
        subscriptionId: subscription.id,
        organization: subscription.organization,
        status: PaymentTransactionStatus.COMPLETED,
        externalTransaction: event.data.object
      }
    })

    return strapi.query('plugin::stripe-payment.subscription').update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.ACTIVE
      }
    })
  },

  async handleInvoicePaymentFailed(event: Stripe.InvoicePaymentFailedEvent) {
    if (event.data.object.billing_reason === BillingReason.Subscription_create) {
      return null
    }

    const subscription = await strapi.query('plugin::stripe-payment.subscription').findOne({
      where: {
        stripe_id: event.data.object.subscription
      },
      populate: {
        organization: true
      }
    })

    if (!subscription) {
      throw new createHttpError.NotFound(`Subscription with stripe id ${event.data.object.subscription} are not found`)
    }

    if (subscription.status === SubscriptionStatus.UNPAID) {
      return subscription
    }

    await strapi.query('plugin::stripe-payment.transaction').create({
      data: {
        subscriptionId: subscription.id,
        organization: subscription.organization,
        status: PaymentTransactionStatus.COMPLETED,
        externalTransaction: event.data.object
      }
    })

    return strapi.query('plugin::stripe-payment.subscription').update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.UNPAID
      }
    })
  },

  async handleSubscriptionUpdated(event: Stripe.CustomerSubscriptionUpdatedEvent): Promise<void> {
    if (event.data.object.status === SubscriptionStatus.TRIALING) {
      return
    }

    const organization = await strapi.query('plugin::stripe-payment.organization').findOne({
      where: {
        customer_id: event.data.object.customer
      }
    })

    const { quantity, price } = event.data.object.items.data[0]

    if (!organization) {
      return
    }

    if (quantity && quantity > organization.quantity) {
      await strapi.query('plugin::stripe-payment.organization').update({
        where: {
          id: organization.id
        },
        data: {
          quantity
        }
      })
    }

    if (price) {
      const plan = await strapi.query('plugin::stripe-payment.plan').findOne({
        where: {
          stripe_id: price.id
        }
      })

      if (plan) {
        await strapi.query('plugin::stripe-payment.subscription').update({
          where: {
            id: event.data.object.id
          },
          data: {
            plan: plan.id,
            status: event.data.object.status
          }
        })
      }
    }
  },

  async handlePaymentMethodAttached(event: Stripe.PaymentMethodAttachedEvent): Promise<void> {
    const customerId = event.data.object.customer
    const paymentMethodId = event.data.object.id

    await strapi
      .plugin('stripe-payment')
      .service('stripe')
      .customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      })

    const organization = await strapi.query('plugin::stripe-payment.organization').findOne({
      where: {
        customer_id: customerId
      }
    })

    if (!organization) {
      await strapi.query('plugin::stripe-payment.organization').create({
        data: {
          customer_id: customerId,
          payment_method_id: paymentMethodId
        }
      })
    } else {
      await strapi.query('plugin::stripe-payment.organization').update({
        where: { customer_id: customerId },
        data: {
          payment_method_id: paymentMethodId
        }
      })
    }
  },

  async handlePriceDeleted(event: Stripe.PriceDeletedEvent) {
    const plan = await strapi.query('plugin::stripe-payment.plan').findOne({
      where: {
        stripe_id: event.data.object.id
      }
    })

    if (!plan) {
      throw new createHttpError.NotFound(`Plan with stripe id ${event.data.object.id} are not found`)
    }

    await strapi.query('plugin::stripe-payment.plan').delete({
      where: {
        id: plan.id
      }
    })
  },

  async handlePriceUpdated(event: Stripe.PriceUpdatedEvent) {
    const existedPlan = await strapi.query('plugin::stripe-payment.plan').findOne({
      where: {
        stripe_id: event.data.object.id
      }
    })

    if (!existedPlan) {
      throw new createHttpError.NotFound(`Plan with stripe id ${event.data.object.id} are not found`)
    }

    const product = await strapi.query('plugin::stripe-payment.product').findOne({
      where: {
        stripe_id: event.data.object.product
      },
      populate: {
        plans: true
      }
    })

    if (!product) {
      throw new createHttpError.NotFound(`Product with stripe id ${event.data.object.product} are not found`)
    }

    const updatedPlans = event.data.object.active
      ? [...product.plans, existedPlan]
      : product.plans.filter((plan: Plan) => plan.stripe_id !== event.data.object.id)

    await strapi.query('plugin::stripe-payment.product').update({
      where: {
        id: product.id
      },
      data: {
        plans: updatedPlans
      }
    })
  },

  async handlePriceCreated(event: Stripe.PriceCreatedEvent): Promise<void> {
    const plan = await strapi.query('plugin::stripe-payment.plan').findOne({
      where: {
        stripe_id: event.data.object.id
      }
    })

    if (plan) {
      return
    }

    const product = await strapi.query('plugin::stripe-payment.product').findOne({
      where: {
        stripe_id: event.data.object.product
      },
      populate: {
        plans: true
      }
    })

    if (!product) {
      throw new createHttpError.NotFound(`Product with stripe id ${event.data.object.product} are not found`)
    }

    const savedPlan = await strapi.query('plugin::stripe-payment.plan').create({
      data: {
        price: (event.data.object.unit_amount as number) / 100,
        interval: event.data.object.recurring?.interval,
        stripe_id: event.data.object.id,
        product: product.id
      }
    })

    await strapi.query('plugin::stripe-payment.product').update({
      where: {
        stripe_id: event.data.object.product
      },
      data: {
        plans: [...product.plans, savedPlan.id]
      }
    })
  },

  async handleProductCreated(event: Stripe.ProductCreatedEvent): Promise<void> {
    const product = await strapi.query('plugin::stripe-payment.product').findOne({
      where: {
        stripe_id: event.data.object.id
      }
    })

    if (product) {
      return
    }

    const savedProduct = await strapi.query('plugin::stripe-payment.product').create({
      data: {
        name: event.data.object.name,
        stripe_id: event.data.object.id
      }
    })

    const prices = await strapi
      .plugin('stripe-payment')
      .service('stripe')
      .prices.list({ product: event.data.object.id })

    const price = prices.data[0]

    const savedPlan = await strapi.query('plugin::stripe-payment.plan').create({
      data: {
        price: price.unit_amount / 100,
        interval: price.recurring?.interval,
        stripe_id: price.id,
        product: savedProduct.id
      }
    })

    await strapi.query('plugin::stripe-payment.product').update({
      where: {
        id: savedProduct.id
      },
      data: {
        plans: [...savedProduct.plans, savedPlan.id]
      }
    })
  },

  async handleProductUpdated(event: Stripe.ProductUpdatedEvent) {
    const product = await strapi.query('plugin::stripe-payment.product').findOne({
      where: {
        stripe_id: event.data.object.id
      },
      populate: {
        plans: true
      }
    })

    if (!product) {
      throw new createHttpError.NotFound(`Product with stripe id ${event.data.object.id} not found`)
    }

    const prices = await strapi
      .plugin('stripe-payment')
      .service('stripe')
      .prices.list({ product: event.data.object.id })

    const existingPlans = product.plans.map((plan: Plan) => plan.stripe_id)
    const newPlansData: Plan[] = []

    prices.data.forEach((price) => {
      if (!existingPlans.includes(price.id)) {
        newPlansData.push({
          price: price.unit_amount / 100,
          interval: price.recurring?.interval,
          stripe_id: price.id,
          product: product.id
        })
      }
    })

    if (newPlansData.length > 0) {
      const newPlans = await strapi.query('plugin::stripe-payment.plan').createMany({
        data: newPlansData
      })

      await strapi.query('plugin::stripe-payment.product').update({
        where: {
          id: product.id
        },
        data: {
          name: event.data.object.name,
          plans: [...product.plans, ...newPlans.ids]
        },
        populate: {
          plans: true
        }
      })
    } else {
      await strapi.query('plugin::stripe-payment.product').update({
        where: {
          id: product.id
        },
        data: {
          name: event.data.object.name
        }
      })
    }
  },

  async handleProductDeleted(event: Stripe.ProductDeletedEvent) {
    const product = await strapi.query('plugin::stripe-payment.product').findOne({
      where: {
        stripe_id: event.data.object.id
      },
      populate: {
        plans: true
      }
    })

    if (!product) {
      throw new createHttpError.NotFound(`Product with stripe id ${event.data.object.id} not found`)
    }

    const planStripeIds = product.plans.map((plan: Plan) => plan.stripe_id)

    await strapi.query('plugin::stripe-payment.plan').deleteMany({
      where: {
        stripe_id: planStripeIds
      }
    })

    await strapi.query('plugin::stripe-payment.product').delete({
      where: {
        id: product.id
      }
    })
  },

  // TODO (#1113): Wrap payment method update with transaction
  async handleSetupIntentSucceeded(event: Stripe.SetupIntentSucceededEvent) {
    const setupIntent = event.data.object

    const organization = await strapi
      .query('plugin::stripe-payment.organization')
      .findOne({ where: { customer_id: setupIntent.customer } })

    if (!organization) {
      throw new createHttpError.NotFound(`Organization with customer_id ${setupIntent.customer} was not found`)
    }

    const newPaymentMethod = await strapi
      .plugin('stripe-payment')
      .service('stripe')
      .paymentMethods.attach(setupIntent.payment_method, {
        customer: setupIntent.customer
      })

    await strapi
      .plugin('stripe-payment')
      .service('stripe')
      .customers.update(organization.customer_id, {
        invoice_settings: {
          default_payment_method: newPaymentMethod.id
        }
      })

    await strapi.query('plugin::stripe-payment.organization').update({
      where: { id: organization.id },
      data: {
        payment_method_id: newPaymentMethod.id
      }
    })
  }
})
