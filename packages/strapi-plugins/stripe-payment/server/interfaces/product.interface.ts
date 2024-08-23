import { Plan } from './plan.interface'

export interface CreateProductParams {
  name: string
}

export interface UpdateProductParams {
  name: string
  id: number
}

export interface GetProductByIdParams {
  id: number
}

export interface DeleteProductParams {
  id: number
}

export interface Product {
  name: string
  id: number
  stripe_id: string
  plans: Plan[]
}
