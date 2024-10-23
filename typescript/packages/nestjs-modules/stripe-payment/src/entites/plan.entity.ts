import { BillingPeriod, PlanType } from '../enums/index.js'

export class PlanEntity {
  id: number

  price: number

  stripeId: string

  interval: BillingPeriod | null

  type: PlanType

  productId: number

  createdAt: Date

  updatedAt: Date
}
