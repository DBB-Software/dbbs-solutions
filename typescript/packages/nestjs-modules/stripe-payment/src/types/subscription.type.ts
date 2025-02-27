import { SubscriptionStatus, SubscriptionStatusId } from '../enums/index.js'
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

export type CreateSubscriptionPayload = {
  stripeId: string
  quantity: number
  organizationId: number
  planId: number
  statusId: SubscriptionStatusId
}

export type ResubscribePayload = {
  stripeId: string
  statusId: number
  quantity: number
}

export type SubscriptionFieldsToUpdate = Partial<{
  statusId: SubscriptionStatusId
  quantity: number
  planId: number
}>
