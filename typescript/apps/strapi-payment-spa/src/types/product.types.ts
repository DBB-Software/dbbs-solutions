import { Plan, Products } from '../interfaces'

export type GetProductsResponse = Products & {
  plans: Plan[]
}
