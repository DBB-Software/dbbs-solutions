import { Inject, Injectable } from '@nestjs/common'
import createHttpError from 'http-errors'
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

    const planData: ICreateStripePriceParams = {
      currency,
      product: productId,
      unit_amount: price * 100 // in cents
    }

    if (type === PlanType.RECURRING) {
      planData.recurring = { interval }
    }

    return this.stripe.prices.create(planData)
  }

  async getPlanById(params: IGetPlanByIdParams) {
    const { id } = params

    try {
      return await this.stripe.prices.retrieve(id)
    } catch {
      throw new createHttpError.NotFound(`Plan with ID ${id} not found`)
    }
  }

  async getPlans(): Promise<Stripe.Price[]> {
    try {
      const { data: prices } = await this.stripe.prices.list()
      return prices
    } catch {
      throw new createHttpError.NotFound('Error fetching plans')
    }
  }

  async delete(params: IDeletePlanParams) {
    const { id } = params

    try {
      await this.stripe.prices.retrieve(id)
    } catch {
      throw new createHttpError.NotFound(`Plan with ID ${id} not found`)
    }

    return this.stripe.prices.update(id, {
      active: false
    })
  }
}
