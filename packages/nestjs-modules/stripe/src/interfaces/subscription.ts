import { PlanType } from '../enums/planType.js'
import { SessionMode } from '../enums/sessionMode.js'

export interface ICreateCheckoutSessionParams {
  successUrl: string
  userId: number
  customerId?: string
  plan: { id: string; dbId: number; type: PlanType }
  quantity: number
  organizationName: string
}

export interface ICreateSessionParams {
  success_url: string
  customer?: string
  metadata: {
    organizationName: string
    quantity: number
    userId: number
    planId: number
  }
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
