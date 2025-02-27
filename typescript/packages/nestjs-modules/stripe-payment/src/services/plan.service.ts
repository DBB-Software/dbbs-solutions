import { HttpStatus, Injectable } from '@nestjs/common'
import { PlanService as StripePriceService } from '@dbbs/nestjs-module-stripe'
import { ArgumentError, NotFoundError } from '@dbbs/common'

import { PlanRepository, ProductRepository } from '../repositories/index.js'
import { ICreatePlanParams, IDeletePlanParams, IPlan } from '../interfaces/index.js'
import { PlanType } from '../enums/index.js'

@Injectable()
export class PlanService {
  constructor(
    private readonly stripePriceService: StripePriceService,
    private readonly productRepository: ProductRepository,
    private readonly planRepository: PlanRepository
  ) {}

  async getPlanById(id: number): Promise<IPlan | null> {
    return this.planRepository.getPlanById(id)
  }

  async createPlan(params: ICreatePlanParams): Promise<IPlan> {
    const { price, interval, productId, type, currency } = params

    if (type === PlanType.RECURRING && !interval) {
      throw new ArgumentError('Cannot create recurring plan without an interval')
    }

    // TODO (#1395): Create NestJS package with custom errors
    const product = await this.productRepository.getProductById(productId)
    if (!product) {
      throw new NotFoundError(`Cannot create plan for non-existing product with ID ${productId}`)
    }

    // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete operations with transaction
    const stripePlan = await this.stripePriceService.create({
      price,
      interval,
      productId: product.stripeId,
      type,
      currency
    })

    return this.planRepository.createPlan({ price, interval, type, stripeId: stripePlan.id, productId: product.id })
  }

  // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete operations with transaction
  // TODO (#1215): Nestjs Stripe-payment: create soft delete
  async deletePlan(params: IDeletePlanParams): Promise<boolean> {
    const { id } = params

    try {
      const dbPlan = await this.planRepository.getPlanById(id)

      if (!dbPlan) {
        return true
      }

      await this.stripePriceService.delete({ id: dbPlan.stripeId })
      await this.planRepository.deletePlan(id)

      return true
    } catch (error) {
      if ((error as NotFoundError)?.statusCode === HttpStatus.NOT_FOUND) {
        return true
      }

      throw error
    }
  }
}
