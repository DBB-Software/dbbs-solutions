import { Inject, Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import createHttpError from 'http-errors'
import { SubscriptionStatus } from '../enums/subscriptionStatus.js'
import {
  ICancelSubscriptionParams,
  IUpdateSubscriptionParams,
  IPauseSubscriptionParams,
  IResumeSubscriptionParams,
  IGetSubscriptionByIdParams,
  ICreateSubscriptionParams,
  ICreateCheckoutSessionParams,
  ICreateSessionParams
} from '../interfaces/index.js'
import { STRIPE_SDK } from '../constants.js'
import { PlanType } from '../enums/planType.js'
import { SessionMode } from '../enums/sessionMode.js'

@Injectable()
export class SubscriptionService {
  constructor(@Inject(STRIPE_SDK) private readonly stripe: Stripe) {}

  async createCheckoutSession(params: ICreateCheckoutSessionParams) {
    const { userId, organizationName, plan, quantity, successUrl, customerId } = params

    if (customerId) {
      try {
        await this.stripe.customers.retrieve(customerId)
      } catch {
        throw new createHttpError.NotFound(`Customer with ID ${customerId} not found`)
      }
    }

    try {
      await this.stripe.prices.retrieve(plan.id)
    } catch {
      throw new createHttpError.NotFound(`Plan with ID ${plan.id} not found`)
    }

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

    try {
      await this.stripe.customers.retrieve(customerId)
    } catch {
      throw new createHttpError.NotFound(`Customer with ID ${customerId} not found`)
    }

    try {
      await this.stripe.prices.retrieve(planId)
    } catch {
      throw new createHttpError.NotFound(`Plan with ID ${planId} not found`)
    }

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

    try {
      return await this.stripe.subscriptions.retrieve(id)
    } catch {
      throw new createHttpError.NotFound(`Subscription with ID ${id} not found`)
    }
  }

  async getSubscriptions() {
    try {
      const { data: subscriptions } = await this.stripe.subscriptions.list()
      return subscriptions
    } catch {
      throw new createHttpError.NotFound('Error fetching subscriptions')
    }
  }

  async pauseSubscription(params: IPauseSubscriptionParams) {
    const { id } = params

    let subscription
    try {
      subscription = await this.stripe.subscriptions.retrieve(id)
    } catch {
      throw new createHttpError.NotFound(`Subscription with ID ${id} not found`)
    }

    if (subscription.pause_collection) {
      throw new createHttpError.BadRequest(`Subscription with ID ${id} not in active state`)
    }

    return this.stripe.subscriptions.update(id, { pause_collection: { behavior: 'void' } })
  }

  async resumeSubscription(params: IResumeSubscriptionParams) {
    const { id } = params

    let subscription
    try {
      subscription = await this.stripe.subscriptions.retrieve(id)
    } catch {
      throw new createHttpError.NotFound(`Subscription with ID ${id} not found`)
    }

    if (!subscription.pause_collection) {
      throw new createHttpError.BadRequest(`Subscription with ID ${id} not in paused state`)
    }

    return this.stripe.subscriptions.update(id, { pause_collection: null })
  }

  async cancelSubscription(params: ICancelSubscriptionParams) {
    const { id } = params

    let subscription
    try {
      subscription = await this.stripe.subscriptions.retrieve(id)
    } catch {
      throw new createHttpError.NotFound(`Subscription with ID ${id} not found`)
    }

    if (subscription.status === SubscriptionStatus.CANCELED) {
      throw new createHttpError.BadRequest(`Subscription with ID ${id} already canceled`)
    }

    return this.stripe.subscriptions.cancel(id)
  }

  async update(params: IUpdateSubscriptionParams) {
    const { planId, quantity, id } = params

    let subscription
    try {
      subscription = await this.stripe.subscriptions.retrieve(id)
    } catch {
      throw new createHttpError.NotFound(`Subscription with ID ${id} not found`)
    }

    let updatedPlanId = subscription.items.data[0].price.id
    if (planId) {
      try {
        await this.stripe.prices.retrieve(planId)
        updatedPlanId = planId
      } catch {
        throw new createHttpError.NotFound(`Plan with ID ${planId} not found`)
      }
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
