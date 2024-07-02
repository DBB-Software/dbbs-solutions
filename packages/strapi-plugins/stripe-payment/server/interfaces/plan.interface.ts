import { BillingPeriod } from '../enums'

export interface CreatePlanParams {
  price: number
  interval: BillingPeriod
  productId: number
}

export interface GetPlanByIdParams {
  id: number
}
