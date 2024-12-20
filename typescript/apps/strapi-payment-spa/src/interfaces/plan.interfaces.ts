import { PlanType } from '../enums'

export interface Plan {
  id: number
  price: number
  stripe_id: string
  interval: string
  createdAt: string
  updatedAt: string | null
  type: PlanType
}
