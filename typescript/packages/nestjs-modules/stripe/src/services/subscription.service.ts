import { Inject, Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { SubscriptionStatus } from '../enums/subscriptionStatus.js'
import {
  ICancelSubscriptionParams,
  IUpdateSubscriptionParams,
  IPauseSubscriptionParams,
  IResumeSubscriptionParams,
  IGetSubscriptionByIdParams,
  ICreateSubscriptionParams,
  ICreateCheckoutSessionParams,
  ICreateSessionParams, IUpdateSubscriptionQuantityParams
} from '../interfaces/index.js'
import { STRIPE_SDK } from '../constants.js'
import { PlanType } from '../enums/planType.js'
import { SessionMode } from '../enums/sessionMode.js'

// TODO (#1395): Create NestJS package with custom errors
@Injectable()
export class SubscriptionService {
  constructor(@Inject(STRIPE_SDK) private readonly stripe: Stripe) {}

  async createCheckoutSession(params: ICreateCheckoutSessionParams) {
    const { userId, organizationName, plan, quantity, successUrl, customerId } = params

    if (customerId) {
      await this.stripe.customers.retrieve(customerId)
    }

    await this.stripe.prices.retrieve(plan.id)

    const sessionParams: ICreateSessionParams = {
      success_url: successUrl,
      metadata: {
        organizationName,
        quantity,
        userId,
        planId: plan.dbId
      },
      line_items: [
        {
          price: plan.id,
          quantity
        }
      ],
      mode: SessionMode.PAYMENT,
      customer: customerId || undefined
    }

    if (plan.type === PlanType.RECURRING) {
      sessionParams.subscription_data = {
        trial_period_days: 30
      }

      sessionParams.mode = SessionMode.SUBSCRIPTION
    }

    return this.stripe.checkout.sessions.create(sessionParams)
  }

  async create(params: ICreateSubscriptionParams) {
    const { customerId, planId, quantity } = params

    await this.stripe.customers.retrieve(customerId)
    await this.stripe.prices.retrieve(planId)

    return this.stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: planId,
          quantity
        }
      ]
    })
  }

  async getSubscriptionById(params: IGetSubscriptionByIdParams) {
    const { id } = params

    return this.stripe.subscriptions.retrieve(id)
  }

  async getSubscriptions() {
    const { data: subscriptions } = await this.stripe.subscriptions.list()
    return subscriptions
  }

  async pauseSubscription(params: IPauseSubscriptionParams) {
    const { id } = params

    const subscription = await this.stripe.subscriptions.retrieve(id)

    if (subscription.pause_collection) {
      throw new Error(`Subscription with ID ${id} not in active state`)
    }

    return this.stripe.subscriptions.update(id, { pause_collection: { behavior: 'void' } })
  }

  async resumeSubscription(params: IResumeSubscriptionParams) {
    const { id } = params

    const subscription = await this.stripe.subscriptions.retrieve(id)

    if (!subscription.pause_collection) {
      throw new Error(`Subscription with ID ${id} not in paused state`)
    }

    return this.stripe.subscriptions.update(id, { pause_collection: null })
  }

  async cancelSubscription(params: ICancelSubscriptionParams) {
    const { id } = params

    const subscription = await this.stripe.subscriptions.retrieve(id)

    if (subscription.status === SubscriptionStatus.CANCELED) {
      throw new Error(`Subscription with ID ${id} already canceled`)
    }

    return this.stripe.subscriptions.cancel(id)
  }

  async updateQuantity(params: IUpdateSubscriptionQuantityParams) {
    const { id, quantity } = params

    const subscription = await this.stripe.subscriptions.retrieve(id)

    return this.stripe.subscriptions.update(id, {
      items: [
        {
          id: subscription.items.data[0].id,
          quantity
        }
      ]
    })
  }

  async update(params: IUpdateSubscriptionParams) {
    const { planId, quantity, id } = params

    const subscription = await this.stripe.subscriptions.retrieve(id)

    let updatedPlanId = subscription.items.data[0].price.id
    if (planId) {
      await this.stripe.prices.retrieve(planId)
      updatedPlanId = planId
    }

    return this.stripe.subscriptions.update(id, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: updatedPlanId,
          quantity
        }
      ]
    })
  }
}
