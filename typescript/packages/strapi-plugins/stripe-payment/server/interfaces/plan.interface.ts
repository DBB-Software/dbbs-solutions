import { BillingPeriod, PlanType } from '../enums'
import { Product } from './product.interface'

export interface CreatePlanParams {
  price: number
  interval: BillingPeriod
  productId: number
  type: PlanType
}

export interface GetPlanByIdParams {
  id: number
}

export interface DeletePlanParams {
  id: number
}

export interface Plan {
  price: number
  interval: BillingPeriod
  stripe_id: string
  product: Product
}

export interface CreateStripePriceParams {
  currency: string
  product: string
  unit_amount: number
  recurring?: {
    interval: BillingPeriod
  }
}
