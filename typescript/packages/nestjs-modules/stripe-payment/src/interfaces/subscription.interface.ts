import { SubscriptionStatus } from '../enums/index.js'
import { IOrganization } from './organization.interface.js'
import { IPlan } from './plan.interface.js'

export interface ISubscription {
  id: number
  stripeId: string
  organization: IOrganization | number
  plan: IPlan | number
  status: SubscriptionStatus | number
  quantity: number
  createdAt: Date
  updatedAt: Date
}

export interface ICreateCheckoutSessionParams {
  quantity: number
  planId: number
  userId: number
  successUrl: string
  organizationName?: string
  organizationId?: number
}
