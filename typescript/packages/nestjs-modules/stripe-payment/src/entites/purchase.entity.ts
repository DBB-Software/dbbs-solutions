import { PlanEntity } from './plan.entity.js'

export class PurchaseEntity {
  id: number

  stripeId: string

  plan: PlanEntity

  organizationId: number

  createdAt: Date

  updatedAt: Date
}
