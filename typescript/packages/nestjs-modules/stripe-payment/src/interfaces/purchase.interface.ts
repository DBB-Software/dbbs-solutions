import { IPlan } from './plan.interface.js'

export interface IPurchase {
  id: number
  stripeId: string
  plan: IPlan
  organizationId: number
  createdAt: Date
  updatedAt: Date
}
