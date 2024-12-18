import { PlanDto } from './plan.dto.js'

export class PurchaseDto {
  id: number

  stripeId: string

  plan: PlanDto

  organizationId: number

  createdAt: Date

  updatedAt: Date
}
