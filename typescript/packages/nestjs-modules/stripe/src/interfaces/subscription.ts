import { SessionMode } from '../enums/sessionMode.js'
import { PlanType } from '../enums/planType.js'

export interface ICreateCheckoutSessionParams {
  successUrl: string
  customerId?: string
  plan: { id: string; type: PlanType }
  quantity: number
}

export interface ICreateSessionParams {
  success_url: string
  customer?: string
  line_items: [
    {
      price: string
      quantity: number
    }
  ]
  mode?: SessionMode
  subscription_data?: {
    trial_period_days: number
  }
}

export interface ICreateSubscriptionParams {
  customerId: string
  planId: string
  quantity: number
}

export interface ICancelSubscriptionParams {
  id: string
}

export interface IPauseSubscriptionParams {
  id: string
}

export interface IResumeSubscriptionParams {
  id: string
}

export interface IGetSubscriptionByIdParams {
  id: string
}

export interface IUpdateSubscriptionParams {
  id: string
  quantity?: number
  planId?: string
}

export interface IUpdateSubscriptionQuantityParams {
  id: string
  quantity: number
}
