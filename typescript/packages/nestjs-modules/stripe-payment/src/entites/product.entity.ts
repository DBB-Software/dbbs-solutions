import { PlanEntity } from './plan.entity.js'

export class ProductEntity {
  id: number

  name: string

  stripeId: string

  plans?: PlanEntity[]

  createdAt: Date

  updatedAt: Date
}
