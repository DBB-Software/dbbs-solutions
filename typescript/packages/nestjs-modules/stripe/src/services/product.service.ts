import { Inject, Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import {
  ICreateProductParams,
  IDeleteProductParams,
  IGetProductByIdParams,
  IUpdateProductParams
} from '../interfaces/index.js'
import { STRIPE_SDK } from '../constants.js'

@Injectable()
export class ProductService {
  constructor(@Inject(STRIPE_SDK) private readonly stripe: Stripe) {}

  async create(params: ICreateProductParams): Promise<Stripe.Product> {
    const { name } = params

    return this.stripe.products.create({ name })
  }

  async getProductById(params: IGetProductByIdParams): Promise<Stripe.Product> {
    const { id } = params

    return this.stripe.products.retrieve(id)
  }

  async getProducts(): Promise<Stripe.Product[]> {
    const { data: products } = await this.stripe.products.list()
    return products
  }

  async update(params: IUpdateProductParams): Promise<Stripe.Product> {
    const { id, name } = params

    return this.stripe.products.update(id, { name })
  }

  async delete(params: IDeleteProductParams) {
    const { id } = params

    return this.stripe.products.del(id)
  }
}
