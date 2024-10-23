import { OrganizationEntity } from './organization.entity.js'
import { PlanEntity } from './plan.entity.js'
import { SubscriptionStatus } from '../enums/index.js'

export class SubscriptionEntity {
  id: number

  stripeId: string

  organization: OrganizationEntity | number

  plan: PlanEntity | number

  status: SubscriptionStatus | number

  quantity: number

  createdAt: Date

  updatedAt: Date
}
