import { BillingPeriod, PlanType } from '../enums/index.js'

export type PlanDbRecord = {
  id: number
  price: number
  stripeId: string
  interval: BillingPeriod | null
  type: PlanType
  productId: number
  createdAt: string
  updatedAt: string
}

export type CreatePlanPayload = {
  price: number
  interval?: BillingPeriod
  stripeId: string
  productId: number
  type: PlanType
}

export type UpdatePlanPayload = {
  id: number
  price: number
  type: PlanType
  interval: BillingPeriod | null
}
