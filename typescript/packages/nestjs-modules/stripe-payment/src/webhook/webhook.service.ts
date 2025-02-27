import { Injectable } from '@nestjs/common'
import {
  InvoiceService as StripeInvoiceService,
  PaymentIntentService as StripePaymentIntentsService,
  ProductService as StripeProductService,
  StripeCheckoutSession,
  StripeCheckoutSessionCompletedEvent,
  StripeInvoicePaymentFailedEvent,
  StripeInvoicePaymentSucceededEvent,
  StripeCustomerSubscriptionUpdatedEvent,
  StripePriceCreatedEvent,
  StripePriceDeletedEvent,
  StripePriceUpdatedEvent,
  StripeProductCreatedEvent,
  StripeProductDeletedEvent,
  StripeProductUpdatedEvent
} from '@dbbs/nestjs-module-stripe'
import { InjectLogger, Logger } from '@dbbs/nestjs-module-logger'
import { ProductRepository } from '../repositories/product.repository.js'
import { PlanRepository } from '../repositories/plan.repository.js'
import {
  BillingPeriod,
  BillingReason,
  CheckoutSessionPaymentMode,
  PlanType,
  SubscriptionStatus,
  SubscriptionStatusId,
  TransactionStatusId
} from '../enums/index.js'
import { handleDbCreateError } from './utils/handleDbCreateError.js'
import { DatabaseError } from '../interfaces/index.js'
import { CheckoutSessionMetadataRepository } from '../repositories/checkoutSessionMetadata.repository.js'
import { OrganizationRepository } from '../repositories/organization.repository.js'
import { SubscriptionRepository } from '../repositories/subscription.repository.js'
import { TransactionRepository } from '../repositories/transaction.repository.js'
import { PurchaseRepository } from '../repositories/purchase.repository.js'
import { CheckoutSessionMetadataService } from '../services/index.js'
import { mapStripeToSubscriptionStatus, mapSubscriptionStatusToStatusId } from '../utils/index.js'

@Injectable()
export class WebhookService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly planRepository: PlanRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly purchaseRepository: PurchaseRepository,
    private readonly stripeProductService: StripeProductService,
    private readonly stripeInvoiceService: StripeInvoiceService,
    private readonly stripePaymentIntentsService: StripePaymentIntentsService,
    private readonly checkoutSessionMetadataRepository: CheckoutSessionMetadataRepository,
    private readonly checkoutSessionMetadataService: CheckoutSessionMetadataService,
    @InjectLogger(WebhookService.name) private readonly logger: Logger
  ) {}

  async handleProductCreated(event: StripeProductCreatedEvent) {
    const { id: stripeId, name } = event.data.object

    try {
      return await this.productRepository.createProduct({ name, stripeId })
    } catch (error) {
      return handleDbCreateError(error as DatabaseError)
    }
  }

  async handleProductUpdated(event: StripeProductUpdatedEvent) {
    const { id: stripeId, name } = event.data.object

    const product = await this.productRepository.getProductByStripeId(stripeId)
    if (!product) {
      return null
    }

    return this.productRepository.updateProduct({ id: product.id, name })
  }

  async handleProductDeleted(event: StripeProductDeletedEvent) {
    const { id: stripeId } = event.data.object

    const product = await this.productRepository.getProductByStripeId(stripeId)
    if (!product) {
      return null
    }

    return this.productRepository.deleteProduct(product.id)
  }

  async handlePriceCreated(event: StripePriceCreatedEvent) {
    const stripePrice = event.data.object

    let product = await this.productRepository.getProductByStripeId(stripePrice.product as string)
    if (!product) {
      const { id: stripeId, name } = await this.stripeProductService.getProductById({
        id: stripePrice.product as string
      })

      product = await this.productRepository.createProduct({ stripeId, name })
    }

    try {
      return await this.planRepository.createPlan({
        price: (stripePrice.unit_amount as number) / 100,
        interval: stripePrice.recurring?.interval as BillingPeriod | undefined,
        stripeId: stripePrice.id,
        productId: product.id,
        type: stripePrice.type as PlanType
      })
    } catch (error) {
      return handleDbCreateError(error as DatabaseError)
    }
  }

  async handlePriceDeleted(event: StripePriceDeletedEvent) {
    const { id: stripeId } = event.data.object

    const plan = await this.planRepository.getPlanByStripeId(stripeId)
    if (!plan) {
      return null
    }

    return this.planRepository.deletePlan(plan.id)
  }

  async handlePriceUpdated(event: StripePriceUpdatedEvent) {
    const { id: stripeId, type, unit_amount: unitAmount, recurring } = event.data.object

    const plan = await this.planRepository.getPlanByStripeId(stripeId)
    if (!plan) {
      return null
    }

    return this.planRepository.updatePlan({
      id: plan.id,
      type: type as PlanType,
      interval: (recurring?.interval as BillingPeriod | undefined) || null,
      price: (unitAmount as number) / 100
    })
  }

  async handleCheckoutSessionCompleted(event: StripeCheckoutSessionCompletedEvent) {
    const checkoutSession = event.data.object

    try {
      switch (checkoutSession.mode) {
        case CheckoutSessionPaymentMode.PAYMENT:
          await this.handlePaymentMode(checkoutSession)
          break
        case CheckoutSessionPaymentMode.SUBSCRIPTION:
          await this.handleSubscriptionMode(checkoutSession)
          break
        default:
          break
      }
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  private async handlePaymentMode(checkoutSession: StripeCheckoutSession) {
    const { id } = checkoutSession

    const metadata = await this.checkoutSessionMetadataRepository.getMetadataByCheckoutSessionStripeId(id)
    if (!metadata) {
      // TODO (#1866): Add proper webhook errors handling
      this.logger.warn(`Metadata not found for session ID ${id}`)
      return
    }
    try {
      this.checkoutSessionMetadataService.validateMetadata(metadata)
    } catch (error) {
      this.logger.error(`Metadata is in the wrong format for session ID ${id}. Reason: ${(error as Error).message}`)
      return
    }

    const { organizationId, planId } = metadata
    const stripeInvoiceId: string = checkoutSession.invoice as string

    const stripeTransaction = await this.stripePaymentIntentsService.getPaymentIntentById({ id: stripeInvoiceId })
    const organization = await this.organizationRepository.getOrganizationById(organizationId)
    if (!organization) {
      this.logger.warn(`Organization with ID ${organizationId} was not found`)
      return
    }

    const existingTransaction = await this.transactionRepository.getTransactionByStripeInvoiceId(stripeTransaction.id)

    // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete operations with transaction
    const purchaseId = await this.purchaseRepository.createPurchase({
      stripeId: stripeTransaction.id,
      planId,
      organizationId
    })

    if (!existingTransaction) {
      await this.transactionRepository.createTransaction({
        organizationId,
        purchaseId,
        stripeInvoiceId: stripeTransaction.id,
        statusId: TransactionStatusId.COMPLETED
      })
    }
  }

  private async handleSubscriptionMode(checkoutSession: StripeCheckoutSession) {
    const { id } = checkoutSession

    const metadata = await this.checkoutSessionMetadataRepository.getMetadataByCheckoutSessionStripeId(id)
    if (!metadata) {
      // TODO (#1866): Add proper webhook errors handling
      this.logger.warn(`Metadata not found for session ID ${id}`)
      return
    }
    try {
      this.checkoutSessionMetadataService.validateMetadata(metadata)
    } catch (error) {
      this.logger.error(`Metadata is in the wrong format for session ID ${id}. Reason: ${(error as Error).message}`)
      return
    }

    const { organizationId, planId, quantity } = metadata
    if (organizationId === undefined) {
      this.logger.warn(`Organization with ID ${organizationId} was not found`)
      return
    }
    const stripeSubscriptionId = checkoutSession.subscription
    const stripeInvoiceId: string = checkoutSession.invoice as string

    const stripeTransaction = await this.stripeInvoiceService.getInvoiceById({ id: stripeInvoiceId })
    const organization = await this.organizationRepository.getOrganizationById(organizationId)
    if (!organization) {
      this.logger.warn(`Organization with ID ${organizationId} was not found`)
      return
    }

    const existingTransaction = await this.transactionRepository.getTransactionByStripeInvoiceId(stripeTransaction.id)

    // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete operations with transaction
    const subscriptionId = await this.subscriptionRepository.createSubscription({
      stripeId: stripeSubscriptionId as string,
      statusId: SubscriptionStatusId.TRIALING,
      organizationId,
      planId,
      quantity
    })

    if (!existingTransaction) {
      await this.transactionRepository.createTransaction({
        organizationId,
        subscriptionId,
        stripeInvoiceId: stripeTransaction.id,
        statusId: TransactionStatusId.COMPLETED
      })
    }
  }

  async handleInvoicePaymentSucceeded(event: StripeInvoicePaymentSucceededEvent) {
    const { id: invoiceId, billing_reason: billingReason, subscription: stripeSubscription } = event.data.object

    if (billingReason === BillingReason.Subscription_create) {
      this.logger.debug('Skip handling invoice payment succeeded as BillingReason is Subscription Create.')
      return
    }

    if (!stripeSubscription) {
      this.logger.debug('Skip handling invoice payment succeeded as subscription null.')
      return
    }

    const subscriptionStripeId = typeof stripeSubscription !== 'string' ? stripeSubscription.id : stripeSubscription

    try {
      const subscription = await this.subscriptionRepository.getSubscriptionByStripeId(subscriptionStripeId)
      if (!subscription) {
        this.logger.warn(
          `Cannot handle invoice payment succeeded as subscription with Stripe ID ${subscriptionStripeId} was not found.`
        )
        return
      }

      if (subscription.status === SubscriptionStatusId.ACTIVE) {
        this.logger.debug('Skip handling invoice payment succeeded as subscription is in ACTIVE status.')
        return
      }

      const existingTransaction = await this.transactionRepository.getTransactionByStripeInvoiceId(invoiceId)
      // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete operations with transaction
      if (!existingTransaction) {
        await this.transactionRepository.createTransaction({
          subscriptionId: subscription.id,
          organizationId: subscription.organization as number,
          statusId: TransactionStatusId.COMPLETED,
          stripeInvoiceId: invoiceId
        })
      }

      await this.subscriptionRepository.updateSubscriptionStatus(subscription.id, SubscriptionStatusId.ACTIVE)
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  async handleInvoicePaymentFailed(event: StripeInvoicePaymentFailedEvent) {
    const { id: invoiceId, subscription: stripeSubscription } = event.data.object

    if (!stripeSubscription) {
      this.logger.debug('Skip handling invoice payment failed as subscription is null.')
      return
    }

    const subscriptionStripeId = typeof stripeSubscription !== 'string' ? stripeSubscription.id : stripeSubscription

    try {
      const subscription = await this.subscriptionRepository.getSubscriptionByStripeId(subscriptionStripeId)
      if (!subscription) {
        this.logger.warn(
          `Cannot handle invoice payment failed as subscription with Stripe ID ${subscriptionStripeId} was not found.`
        )
        return
      }

      if (subscription.status === SubscriptionStatusId.UNPAID) {
        this.logger.debug(`Skip handling invoice payment failed as subscription is in UNPAID status.`)
        return
      }

      const existingTransaction = await this.transactionRepository.getTransactionByStripeInvoiceId(invoiceId)
      // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete operations with transaction
      if (!existingTransaction) {
        await this.transactionRepository.createTransaction({
          subscriptionId: subscription.id,
          organizationId: subscription.organization as number,
          statusId: TransactionStatusId.COMPLETED,
          stripeInvoiceId: invoiceId
        })
      }

      await this.subscriptionRepository.updateSubscriptionStatus(subscription.id, SubscriptionStatusId.UNPAID)
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  async handleSubscriptionUpdated(event: StripeCustomerSubscriptionUpdatedEvent) {
    const { id, status, customer, items } = event.data.object
    if (status === SubscriptionStatus.TRIALING) {
      this.logger.debug('Skip handling subscription updated as subscription status is TRIALING')
      return
    }

    const subscription = await this.subscriptionRepository.getSubscriptionByStripeId(id)
    if (!subscription) {
      this.logger.debug(`Skip handling subscription updated as subscription with ID ${id} was not found.`)
      return
    }

    const customerId = typeof customer !== 'string' ? customer.id : customer

    const organization = await this.organizationRepository.getOrganizationByStripeCustomerId(customerId)
    if (!organization) {
      this.logger.debug(
        `Skip handling subscription updated as organization with Stripe ID ${customerId} was not found.`
      )
      return
    }

    const { quantity, price: stripePlan } = items.data[0]
    if (quantity && quantity > organization.quantity) {
      await this.organizationRepository.updateOrganization({ id: organization.id, quantity })
    }

    const stripeSubscriptionStatusId = mapSubscriptionStatusToStatusId(mapStripeToSubscriptionStatus(status))
    if (stripeSubscriptionStatusId !== subscription.status) {
      await this.subscriptionRepository.updateSubscriptionStatus(
        subscription.id,
        mapSubscriptionStatusToStatusId(mapStripeToSubscriptionStatus(status))
      )
    }
    if (stripePlan) {
      const plan = await this.planRepository.getPlanByStripeId(stripePlan.id)

      if (plan) {
        await this.subscriptionRepository.updateSubscriptionPlan(subscription.id, plan.id)
      }
    }
  }
}
