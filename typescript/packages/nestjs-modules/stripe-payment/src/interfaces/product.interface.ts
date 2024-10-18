import { IPlan } from './plan.interface.js'

export interface IProduct {
  id: number
  name: string
  stripeId: string
  plans?: IPlan[]
  createdAt: Date
  updatedAt: Date
}

export interface ICreateProductParams {
  name: string
}

export interface IUpdateProductParams {
  name: string
  id: number
}

export interface IDeleteProductParams {
  id: number
}
