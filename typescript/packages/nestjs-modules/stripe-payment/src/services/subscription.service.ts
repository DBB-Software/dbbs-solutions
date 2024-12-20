import { Injectable } from '@nestjs/common'
import { SubscriptionService as StripeSubscriptionService } from '@dbbs/nestjs-module-stripe'
import { ArgumentError, NotFoundError } from '@dbbs/common'
import { SubscriptionRepository } from '../repositories/subscription.repository.js'
import {
  ICreateCheckoutSessionParams,
  IPaginatedResponse,
  IPaginationOptions,
  IPlan,
  ISubscription
} from '../interfaces/index.js'
import { PlanType, SubscriptionStatus, SubscriptionStatusId } from '../enums/index.js'
import { OrganizationRepository } from '../repositories/organization.repository.js'
import { PlanRepository } from '../repositories/plan.repository.js'
import { CheckoutSessionMetadataRepository } from '../repositories/checkoutSessionMetadata.repository.js'

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly stripeSubscriptionService: StripeSubscriptionService,
    private readonly organizationRepository: OrganizationRepository,
    private readonly planRepository: PlanRepository,
    private readonly checkoutSessionMetadataRepository: CheckoutSessionMetadataRepository
  ) {}

  private async retrieveAndValidateSubscription(id: number, populateRelations: boolean = true): Promise<ISubscription> {
    const subscription = await this.subscriptionRepository.getSubscriptionById(id, populateRelations)

    if (!subscription) {
      // TODO (#1395): Create NestJS package with custom errors
      throw new NotFoundError(`Subscription with ID ${id} was not found`)
    }

    return subscription
  }

  private async resolveOrganizationIdentifiers(
    organizationName?: string,
    organizationId?: number
  ): Promise<{ name: string; stripeCustomerId?: string }> {
    if (!organizationName && !organizationId) {
      throw new ArgumentError('Either organizationName or organizationId must be provided')
    }

    if (organizationName) {
      const organizationExists = await this.organizationRepository.organizationExistsByName(organizationName)
      if (organizationExists) {
        throw new Error(`Organization '${organizationName}' already exists`)
      }
      return { name: organizationName }
    }

    const organization = await this.organizationRepository.getOrganizationById(organizationId!)
    if (!organization) {
      throw new NotFoundError(`Organization with ID ${organizationId} was not found`)
    }

    const subscriptionStatusId = await this.subscriptionRepository.getStatusIdByOrganizationId(organizationId!)
    if (subscriptionStatusId !== SubscriptionStatusId.CANCELED) {
      throw new Error(
        `Cannot create a checkout session for organization with ID ${organizationId} as it has a non-canceled subscription`
      )
    }

    return {
      name: organization.name,
      stripeCustomerId: organization.stripeCustomerId
    }
  }

  private async getValidPlanById(planId: number): Promise<IPlan> {
    const plan = await this.planRepository.getPlanById(planId)
    if (!plan) {
      throw new NotFoundError(`Plan with ID ${planId} was not found`)
    }
    if (plan.type === PlanType.ONE_TIME) {
      throw new Error('Creating a checkout session for a one-time plan is not allowed')
    }
    return plan
  }

  async createCheckoutSession(params: ICreateCheckoutSessionParams): Promise<string> {
    const { userId, planId, quantity, successUrl, organizationName, organizationId } = params

    const { name, stripeCustomerId } = await this.resolveOrganizationIdentifiers(organizationName, organizationId)

    const plan = await this.getValidPlanById(planId)

    const session = await this.stripeSubscriptionService.createCheckoutSession({
      successUrl,
      plan: {
        id: plan.stripeId,
        type: plan.type
      },
      quantity,
      ...(stripeCustomerId && { customerId: stripeCustomerId })
    })

    if (!session.url) {
      throw new Error('Checkout session was created, but no URL was returned')
    }

    await this.checkoutSessionMetadataRepository.saveMetadata({
      checkoutSessionStripeId: session.id,
      organizationName: name,
      planId: plan.id,
      userId,
      quantity
    })

    return session.url
  }

  async getSubscriptions(
    paginationOptions: IPaginationOptions = { page: 1, perPage: 10 }
  ): Promise<IPaginatedResponse<ISubscription>> {
    const { page = 1, perPage = 10 } = paginationOptions

    const { subscriptions, total } = await this.subscriptionRepository.getSubscriptions({
      skip: (page - 1) * perPage,
      limit: perPage
    })

    return {
      items: subscriptions,
      total,
      page,
      perPage
    }
  }

  getSubscriptionById(id: number): Promise<ISubscription | null> {
    return this.subscriptionRepository.getSubscriptionById(id)
  }

  async cancelSubscription(id: number): Promise<ISubscription> {
    const subscription = await this.retrieveAndValidateSubscription(id, false)

    // TODO (#1395): Create NestJS package with custom errors
    if (subscription.status === SubscriptionStatusId.CANCELED) {
      throw new ArgumentError(`Subscription with ID ${id} is already canceled`)
    }

    // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete operations with transaction
    await this.stripeSubscriptionService.cancelSubscription({ id: subscription.stripeId })
    const canceledSubscription = await this.subscriptionRepository.updateSubscriptionStatus(
      id,
      SubscriptionStatusId.CANCELED
    )

    if (!canceledSubscription) {
      throw new Error(`Subscription cancellation failed for ID ${id}: status update was unsuccessful`)
    }
    return canceledSubscription
  }

  async pauseSubscription(id: number): Promise<ISubscription> {
    const subscription = await this.retrieveAndValidateSubscription(id, false)

    // TODO (#1395): Create NestJS package with custom errors
    if (subscription.status !== SubscriptionStatusId.ACTIVE) {
      throw new ArgumentError(`Subscription with ID ${id} is not in active state`)
    }

    // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete operations with transaction
    await this.stripeSubscriptionService.pauseSubscription({ id: subscription.stripeId })
    const pausedSubscription = await this.subscriptionRepository.updateSubscriptionStatus(
      id,
      SubscriptionStatusId.PAUSED
    )

    if (!pausedSubscription) {
      throw new Error(`Subscription pause failed for ID ${id}: status update was unsuccessful`)
    }
    return pausedSubscription
  }

  async resumeSubscription(id: number): Promise<ISubscription> {
    const subscription = await this.retrieveAndValidateSubscription(id, false)

    // TODO (#1395): Create NestJS package with custom errors
    if (subscription.status !== SubscriptionStatusId.PAUSED) {
      throw new ArgumentError(`Subscription with ID ${id} is not in paused state`)
    }

    // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete operations with transaction
    await this.stripeSubscriptionService.resumeSubscription({ id: subscription.stripeId })
    const resumedSubscription = await this.subscriptionRepository.updateSubscriptionStatus(
      id,
      SubscriptionStatusId.ACTIVE
    )

    if (!resumedSubscription) {
      throw new Error(`Subscription resume failed for ID ${id}: status update was unsuccessful`)
    }
    return resumedSubscription
  }

  // TODO (#1484): NestJS Stipe-payment package: implement update subscription plan
  async updateSubscriptionQuantity(id: number, quantity: number): Promise<ISubscription> {
    const subscription = await this.retrieveAndValidateSubscription(id, false)

    const { organization } = subscription
    if (typeof organization !== 'number') {
      throw new Error('Subscription data is invalid. Organization must not be populated')
    }

    const organizationUsersCount = await this.organizationRepository.countUsers(organization)
    const numberOfAvailableSeats = await this.organizationRepository.getQuantity(organization)

    if (numberOfAvailableSeats === undefined) {
      throw new Error('Failed to get number of available seats for the subscription')
    }

    if (quantity < organizationUsersCount) {
      throw new ArgumentError('Invalid quantity')
    }

    if (quantity > numberOfAvailableSeats) {
      throw new ArgumentError(
        'The new quantity exceeds the available seats in the organization. Please add more seats.'
      )
    }

    // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete operations with transaction
    await this.stripeSubscriptionService.updateQuantity({ id: subscription.stripeId, quantity })
    const updatedSubscription = await this.subscriptionRepository.updateSubscriptionQuantity(id, quantity)

    if (!updatedSubscription) {
      throw new Error(`Failed to update the quantity for subscription ID ${id}: the database update was unsuccessful`)
    }
    return updatedSubscription
  }

  async resubscribe(id: number): Promise<boolean> {
    const subscription = await this.retrieveAndValidateSubscription(id)

    const { organization, plan, status } = subscription
    if (typeof organization === 'number' || typeof plan === 'number' || typeof status === 'number') {
      throw new Error('Subscription data is invalid. Organization, Plan and Status must be populated')
    }

    if (status !== SubscriptionStatus.CANCELED) {
      throw new Error(
        `Resubscription failed: Subscription is currently '${status}', but only canceled subscriptions can be resubscribed`
      )
    }

    const quantity = await this.organizationRepository.countUsers(organization.id)
    const planId = plan.stripeId
    const { stripeCustomerId: customerId } = organization

    const newStripeSubscription = await this.stripeSubscriptionService.create({ quantity, customerId, planId })
    await this.subscriptionRepository.resubscribe(subscription.id, {
      statusId: SubscriptionStatusId.ACTIVE,
      stripeId: newStripeSubscription.id,
      quantity
    })

    return true
  }

  async deleteSubscription(id: number): Promise<boolean> {
    const subscription = await this.subscriptionRepository.getSubscriptionById(id, false)
    if (!subscription || subscription.status === SubscriptionStatusId.CANCELED) {
      return true
    }

    // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete operations with transaction
    await this.stripeSubscriptionService.cancelSubscription({ id: subscription.stripeId })
    await this.subscriptionRepository.deleteSubscription(subscription.id)

    return true
  }
}
