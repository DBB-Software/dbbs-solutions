import { BillingPeriod, PlanType } from '../enums/planType.js'

export interface IGetPlanByIdParams {
  id: string
}

export interface ICreatePlanParams {
  price: number
  currency: string
  interval: BillingPeriod
  productId: string
  type: PlanType
}

export interface ICreateStripePriceParams {
  currency: string
  product: string
  unit_amount: number
  recurring?: {
    interval: BillingPeriod
  }
}

export interface IDeletePlanParams {
  id: string
}
