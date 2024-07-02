/**
 *  service
 */

import { Stripe } from 'stripe'
import { factories, Strapi } from '@strapi/strapi'
import { CreatePlanParams, GetPlanByIdParams } from '../interfaces'

export default factories.createCoreService('plugin::stripe-payment.plan', ({ strapi }: { strapi: Strapi }) => ({
  async create(params: CreatePlanParams) {
    const { price, interval, productId } = params

    const stripeCurrency: string = strapi.config.get('server.stripe.currency')

    const product = await strapi.query('plugin::stripe-payment.product').findOne({ where: { id: productId } })

    const plan = await strapi
      .plugin('stripe-payment')
      .service('stripe')
      .prices.create({
        currency: stripeCurrency,
        product: product.stripe_id,
        recurring: { interval },
        unit_amount: price * 100 // in cents
      })

    const savedPlan = await strapi.query('plugin::stripe-payment.plan').create({
      data: {
        price,
        interval,
        stripe_id: plan.id,
        product: product.id
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
  }
}))
