/**
 *  controller
 */

import { factories, Strapi } from '@strapi/strapi'
import { errors } from '@strapi/utils'
import { CreatePlanParams, GetPlanByIdParams } from '../interfaces'

// TODO: add types & validation
export default factories.createCoreController('plugin::stripe-payment.plan', ({ strapi }: { strapi: Strapi }) => ({
  async create(ctx) {
    const data = ctx.request.body as CreatePlanParams
    const plan = await strapi.plugin('stripe-payment').service('plan').create(data)
    ctx.send(plan)
  },

  async getPlanById(ctx) {
    const { id } = ctx.params as GetPlanByIdParams
    const plan = await strapi.plugin('stripe-payment').service('plan').getPlanById({ id })

    if (!plan) {
      throw new errors.NotFoundError(`Plan with ID ${id} not found`)
    }

    ctx.send(plan)
  },

  async getPlans(ctx) {
    const products = await strapi.plugin('stripe-payment').service('plan').getPlans()
    ctx.send(products)
  }
}))
