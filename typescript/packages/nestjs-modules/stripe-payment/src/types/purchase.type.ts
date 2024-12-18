import { PlanDbRecord } from './plan.type.js'

export type PurchaseDbRecord = {
  id: number
  stripeId: string
  plan: PlanDbRecord
  organizationId: number
  createdAt: string
  updatedAt: string
}
