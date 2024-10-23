import { PlanDbRecord } from './plan.type.js'

export type ProductDbRecord = {
  id: number
  name: string
  stripeId: string
  createdAt: string
  updatedAt: string
  plans?: PlanDbRecord[]
}

export type CreateProductPayload = {
  name: string
  stripeId: string
}

export type UpdateProductPayload = {
  id: number
  name: string
}
