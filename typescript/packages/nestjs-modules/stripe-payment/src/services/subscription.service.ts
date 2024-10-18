import { Injectable } from '@nestjs/common'
import { SubscriptionService as StripeSubscriptionService } from '@dbbs/nestjs-module-stripe'
import { ArgumentError, NotFoundError } from '@dbbs/common'
import { SubscriptionRepository } from '../repositories/subscription.repository.js'
import { IPaginatedResponse, IPaginationOptions, ISubscription } from '../interfaces/index.js'
import { SubscriptionStatus, SubscriptionStatusId } from '../enums/index.js'
import { OrganizationRepository } from '../repositories/organization.repository.js'

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly stripeSubscriptionService: StripeSubscriptionService,
    private readonly organizationRepository: OrganizationRepository
  ) {}

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

  async cancelSubscription(id: number): Promise<ISubscription | null> {
    const subscription = await this.subscriptionRepository.getSubscriptionById(id, false)

    // TODO (#1395): Create NestJS package with custom errors
    if (!subscription) {
      throw new NotFoundError(`Cannot cancel non-existing subscription with ID ${id}`)
    }

    // TODO (#1395): Create NestJS package with custom errors
    if (subscription.status === SubscriptionStatusId.CANCELED) {
      throw new ArgumentError(`Subscription with ID ${id} is already canceled`)
    }

    // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete operations with transaction
    await this.stripeSubscriptionService.cancelSubscription({ id: subscription.stripeId })
    return this.subscriptionRepository.updateSubscriptionStatus(id, SubscriptionStatusId.CANCELED)
  }

  async pauseSubscription(id: number): Promise<ISubscription | null> {
    const subscription = await this.subscriptionRepository.getSubscriptionById(id, false)

    // TODO (#1395): Create NestJS package with custom errors
    if (!subscription) {
      throw new NotFoundError(`Cannot pause non-existing subscription with ID ${id}`)
    }

    // TODO (#1395): Create NestJS package with custom errors
    if (subscription.status !== SubscriptionStatusId.ACTIVE) {
      throw new ArgumentError(`Subscription with ID ${id} is not in active state`)
    }

    // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete operations with transaction
    await this.stripeSubscriptionService.pauseSubscription({ id: subscription.stripeId })
    return this.subscriptionRepository.updateSubscriptionStatus(id, SubscriptionStatusId.PAUSED)
  }

  async resumeSubscription(id: number): Promise<ISubscription | null> {
    const subscription = await this.subscriptionRepository.getSubscriptionById(id, false)

    // TODO (#1395): Create NestJS package with custom errors
    if (!subscription) {
      throw new NotFoundError(`Cannot resume non-existing subscription with ID ${id}`)
    }

    // TODO (#1395): Create NestJS package with custom errors
    if (subscription.status !== SubscriptionStatusId.PAUSED) {
      throw new ArgumentError(`Subscription with ID ${id} is not in paused state`)
    }

    // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete operations with transaction
    await this.stripeSubscriptionService.resumeSubscription({ id: subscription.stripeId })
    return this.subscriptionRepository.updateSubscriptionStatus(id, SubscriptionStatusId.ACTIVE)
  }

  // TODO (#1484): NestJS Stipe-payment package: implement update subscription plan
  async updateSubscriptionQuantity(id: number, quantity: number) {
    const subscription = await this.subscriptionRepository.getSubscriptionById(id, false)
    if (!subscription) {
      throw new NotFoundError(`Cannot update non-existing subscription with ID ${id}`)
    }

    const organizationId = subscription.organization as number
    const organizationUsersCount = await this.organizationRepository.countUsers(organizationId)
    const numberOfAvailableSeats = (await this.organizationRepository.getQuantity(organizationId)) as number

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
    return this.subscriptionRepository.updateSubscriptionQuantity(id, quantity)
  }

  async resubscribe(id: number): Promise<boolean> {
    const subscription = await this.subscriptionRepository.getSubscriptionById(id)
    if (!subscription) {
      throw new NotFoundError(`Subscription with ID ${id} was not found`)
    }

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
