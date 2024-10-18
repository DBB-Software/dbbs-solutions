import { BillingPeriod, Currency, PlanType } from '../enums/index.js'

export interface IPlan {
  id: number
  price: number
  stripeId: string
  interval: BillingPeriod | null
  type: PlanType
  productId: number
  createdAt: Date
  updatedAt: Date
}

export interface ICreatePlanParams {
  price: number
  interval?: BillingPeriod
  productId: number
  type: PlanType
  currency: Currency
}

export interface IDeletePlanParams {
  id: number
}
