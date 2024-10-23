import { Inject, Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { STRIPE_SDK } from '../constants.js'
import {
  ICreatePlanParams,
  ICreateStripePriceParams,
  IDeletePlanParams,
  IGetPlanByIdParams
} from '../interfaces/plan.js'
import { PlanType } from '../enums/planType.js'

@Injectable()
export class PlanService {
  constructor(@Inject(STRIPE_SDK) private readonly stripe: Stripe) {}

  async create(params: ICreatePlanParams) {
    const { price, interval, productId, type, currency } = params

    if (type === PlanType.RECURRING && !interval) {
      throw new Error('Interval must be provided for recurring plan')
    }

    const planData: ICreateStripePriceParams = {
      currency,
      product: productId,
      unit_amount: price * 100, // in cents
      ...(type === PlanType.RECURRING && { recurring: { interval: interval! } })
    }

    return this.stripe.prices.create(planData)
  }

  async getPlanById(params: IGetPlanByIdParams) {
    const { id } = params

    return this.stripe.prices.retrieve(id)
  }

  // TODO (#1406): NestJS Stripe package: create custom types on top of Stripe SDK types
  async getPlans(): Promise<Stripe.Price[]> {
    const { data: prices } = await this.stripe.prices.list()
    return prices
  }

  async delete(params: IDeletePlanParams) {
    const { id } = params

    return this.stripe.prices.update(id, {
      active: false
    })
  }
}
