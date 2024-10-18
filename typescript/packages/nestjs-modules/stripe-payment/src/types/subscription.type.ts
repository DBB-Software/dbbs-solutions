import { SubscriptionStatus } from '../enums/index.js'
import { PlanDbRecord } from './plan.type.js'
import { OrganizationDbRecord } from './organization.type.js'

export type SubscriptionDbRecord = {
  id: number
  stripeId: string
  quantity: number
  organization: OrganizationDbRecord | number
  plan: PlanDbRecord | number
  status: SubscriptionStatus | number
  createdAt: string
  updatedAt: string
}

export type ResubscribePayload = {
  stripeId: string
  statusId: number
  quantity: number
}
