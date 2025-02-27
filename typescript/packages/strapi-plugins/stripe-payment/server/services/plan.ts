/**
 *  service
 */

import createHttpError from 'http-errors'
import { factories, Strapi } from '@strapi/strapi'
import { CreatePlanParams, CreateStripePriceParams, DeletePlanParams, GetPlanByIdParams } from '../interfaces'
import { PlanType } from '../enums'

export default factories.createCoreService('plugin::stripe-payment.plan', ({ strapi }: { strapi: Strapi }) => ({
  async create(params: CreatePlanParams) {
    const { price, interval, productId, type } = params

    const stripeCurrency: string = strapi.config.get('server.stripe.currency')

    const product = await strapi.query('plugin::stripe-payment.product').findOne({
      where: { id: productId },
      populate: {
        plans: true
      }
    })

    if (!product) {
      throw new createHttpError.NotFound(`Cannot create a plan as the product with ID ${productId} was not found`)
    }

    const planData: CreateStripePriceParams = {
      currency: stripeCurrency,
      product: product.stripe_id,
      unit_amount: price * 100 // in cents
    }

    if (type === PlanType.RECURRING) {
      planData.recurring = { interval }
    }

    const plan = await strapi.plugin('stripe-payment').service('stripe').prices.create(planData)

    const savedPlan = await strapi.query('plugin::stripe-payment.plan').create({
      data: {
        price,
        interval,
        type,
        stripe_id: plan.id,
        product: product.id
      }
    })

    await strapi.query('plugin::stripe-payment.product').update({
      where: {
        id: product.id
      },
      data: {
        plans: [...product.plans, savedPlan.id]
      }
    })

    return savedPlan
  },

  async getPlanById(params: GetPlanByIdParams) {
    const { id } = params
    const plan = await strapi.query('plugin::stripe-payment.plan').findOne({
      where: { id }
    })

    return plan
  },

  async getPlans() {
    const plans = await strapi.query('plugin::stripe-payment.plan').findMany({})

    return plans
  },

  async delete(params: DeletePlanParams) {
    const { id } = params
    const plan = await strapi.query('plugin::stripe-payment.plan').findOne({
      where: { id },
      populate: {
        product: true
      }
    })

    if (!plan) {
      return null
    }

    await strapi.plugin('stripe-payment').service('stripe').prices.update(plan.stripe_id, {
      active: false
    })
    await strapi.query('plugin::stripe-payment.plan').delete({ where: { id } })

    return { id }
  }
}))
