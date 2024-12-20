import { Plan } from './plan.interfaces.ts'

export interface Subscription {
  id: number
  stripe_id: string
  status: string
  createdAt: string
  updatedAt: string
  quantity: number
  plan: Plan
}
