import Stripe from 'stripe'
import { Strapi } from '@strapi/strapi'
import { errors } from '@strapi/utils'
import createHttpError from 'http-errors'
import { BillingReason, StripeEventType, SubscriptionStatus } from '../enums'

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
      default:
        break
    }
  },

  // TODO: create payment transaction
  async handleCheckoutSessionCompleted(event: Stripe.CheckoutSessionCompletedEvent) {
    try {
      const { metadata } = event.data.object

      if (!metadata?.organizationName || !metadata?.userId || !metadata?.planId || !metadata?.quantity) {
        throw new createHttpError.BadRequest('Metadata is missing required fields')
      }

      const { organizationName, userId, planId, quantity } = metadata
      const customerId = event.data.object.customer
      const stripeSubscriptionId = event.data.object.subscription

      let organization = await strapi.query('plugin::stripe-payment.organization').findOne({
        where: {
          customer_id: customerId
        }
      })

      if (!organization) {
        organization = await strapi.query('plugin::stripe-payment.organization').create({
          data: {
            name: organizationName,
            customer_id: customerId,
            owner_id: userId,
            users: [userId],
            quantity: parseInt(quantity, 10)
          }
        })
      }

      const subscription = await strapi.query('plugin::stripe-payment.subscription').create({
        data: {
          status: SubscriptionStatus.TRIALING,
          price: planId,
          stripe_id: stripeSubscriptionId,
          organization: organization.id,
          plan: planId
        }
      })

      await strapi.query('plugin::stripe-payment.organization').update({
        where: { id: organization.id },
        data: {
          name: organizationName,
          owner_id: userId,
          users: [userId],
          quantity: parseInt(quantity, 10),
          subscription: subscription.id
        }
      })
    } catch (e) {
      console.error(e)
      throw new Error('Could not create subscription or organization')
    }
  },

  // TODO: create payment transaction
  async handleInvoicePaymentSucceeded(event: Stripe.InvoicePaymentSucceededEvent) {
    if (event.data.object.billing_reason === BillingReason.Subscription_create) {
      return null
    }

    const subscription = await strapi.query('plugin::stripe-payment.subscription').findOne({
      where: {
        stripe_id: event.data.object.subscription
      }
    })

    if (!subscription) {
      return null
    }

    if (subscription.status === SubscriptionStatus.ACTIVE) {
      return subscription
    }

    return strapi.query('plugin::stripe-payment.subscription').update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.ACTIVE
      }
    })
  },

  // TODO: create payment transaction
  async handleInvoicePaymentFailed(event: Stripe.InvoicePaymentFailedEvent) {
    if (event.data.object.billing_reason === BillingReason.Subscription_create) {
      return null
    }

    const subscription = await strapi.query('plugin::stripe-payment.subscription').findOne({
      where: {
        stripe_id: event.data.object.subscription
      }
    })

    if (!subscription) {
      return null
    }

    if (subscription.status === SubscriptionStatus.UNPAID) {
      return subscription
    }

    return strapi.query('plugin::stripe-payment.subscription').update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.UNPAID
      }
    })
  },

  async handleSubscriptionUpdated(event: Stripe.CustomerSubscriptionUpdatedEvent) {
    if (event.data.object.status === SubscriptionStatus.TRIALING) {
      return null
    }

    const organization = await strapi.query('plugin::stripe-payment.organization').findOne({
      where: {
        customer_id: event.data.object.customer
      }
    })

    const { quantity, price } = event.data.object.items.data[0]

    if (quantity && quantity > organization.quantity) {
      await strapi.query('plugin::stripe-payment.organization').update({
        where: {
          id: organization.id
        },
        data: {
          quantity: event.data.object.items.data[0].quantity
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

  async handlePaymentMethodAttached(event: Stripe.PaymentMethodAttachedEvent) {
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
  }
})
