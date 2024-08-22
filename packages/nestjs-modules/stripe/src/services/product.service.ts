import { Inject, Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import createHttpError from 'http-errors'
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

    try {
      return await this.stripe.products.retrieve(id)
    } catch {
      throw new createHttpError.NotFound(`Product with ID ${id} not found`)
    }
  }

  async getProducts(): Promise<Stripe.Product[]> {
    try {
      const { data: products } = await this.stripe.products.list()
      return products
    } catch {
      throw new createHttpError.NotFound('Error fetching products')
    }
  }

  async update(params: IUpdateProductParams): Promise<Stripe.Product> {
    const { id, name } = params

    try {
      await this.stripe.products.retrieve(id)
    } catch {
      throw new createHttpError.NotFound(`Product with ID ${id} not found`)
    }

    return this.stripe.products.update(id, { name })
  }

  async delete(params: IDeleteProductParams) {
    const { id } = params

    try {
      await this.stripe.products.retrieve(id)
    } catch {
      throw new createHttpError.NotFound(`Product with ID ${id} not found`)
    }

    return this.stripe.products.del(id)
  }
}
