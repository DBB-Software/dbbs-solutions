import { Injectable } from '@nestjs/common'
import { ProductService as StripeProductService } from '@dbbs/nestjs-module-stripe'
import { ArgumentError, NotFoundError } from '@dbbs/common'

import { ProductRepository } from '../repositories/index.js'
import {
  ICreateProductParams,
  IDeleteProductParams,
  IProduct,
  IUpdateProductParams,
  IPaginationOptions,
  IPaginatedResponse
} from '../interfaces/index.js'

@Injectable()
export class ProductService {
  constructor(
    private readonly stripeProductService: StripeProductService,
    private readonly productRepository: ProductRepository
  ) {}

  async getProducts(
    paginationOptions: IPaginationOptions = { page: 1, perPage: 10 }
  ): Promise<IPaginatedResponse<IProduct>> {
    const { page = 1, perPage = 10 } = paginationOptions

    const { products, total } = await this.productRepository.getProducts({ skip: (page - 1) * perPage, limit: perPage })

    return {
      items: products,
      total,
      page,
      perPage
    }
  }

  async getProductById(id: number): Promise<IProduct | null> {
    return this.productRepository.getProductById(id, true)
  }

  async createProduct(params: ICreateProductParams): Promise<IProduct> {
    const { name } = params

    // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete operations with transaction
    const stripeProduct = await this.stripeProductService.create({ name })

    return this.productRepository.createProduct({
      stripeId: stripeProduct.id,
      name
    })
  }

  async updateProduct(params: IUpdateProductParams): Promise<IProduct> {
    const { id, name } = params
    const product = await this.productRepository.getProductById(id)

    // TODO (#1395): Create NestJS package with custom errors
    if (!product) {
      throw new NotFoundError(`Cannot update non-existing product with ID ${id}`)
    }

    // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete operations with transaction
    await this.stripeProductService.update({
      id: product.stripeId,
      name
    })

    const updatedProduct = await this.productRepository.updateProduct({ id, name })

    if (!updatedProduct) {
      throw new Error(`Failed to update a product with ID ${id}: the database update was unsuccessful`)
    }
    return updatedProduct
  }

  async deleteProduct(params: IDeleteProductParams): Promise<boolean> {
    const { id } = params
    const product = await this.productRepository.getProductById(id, true)

    if (!product) {
      return true
    }

    // TODO (#1395): Create NestJS package with custom errors
    if (product.plans && product.plans.length > 0) {
      throw new ArgumentError('You cannot delete a product with plans')
    }

    // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete operations with transaction
    // TODO (#1215): Nestjs Stripe-payment: create soft delete
    await this.stripeProductService.delete({ id: product.stripeId })
    await this.productRepository.deleteProduct(id)

    return true
  }
}
