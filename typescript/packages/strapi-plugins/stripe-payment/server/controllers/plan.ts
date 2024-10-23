import { factories, Strapi } from '@strapi/strapi'
import { errors } from '@strapi/utils'
import { CreatePlanParams, DeletePlanParams, GetPlanByIdParams } from '../interfaces'
import { createPlanSchema, deletePlanSchema, getPlanByIdSchema } from '../validationSchemas'
import { validateWithYupSchema } from '../helpers'

export default factories.createCoreController('plugin::stripe-payment.plan', ({ strapi }: { strapi: Strapi }) => ({
  async create(ctx) {
    const { price, interval, productId, type } = ctx.request.body as CreatePlanParams

    await validateWithYupSchema(createPlanSchema, {
      price,
      interval,
      productId,
      type
    })

    const plan = await strapi.plugin('stripe-payment').service('plan').create({
      price,
      interval,
      productId,
      type
    })
    ctx.send(plan)
  },

  async getPlanById(ctx) {
    const { id } = ctx.params as GetPlanByIdParams

    await validateWithYupSchema(getPlanByIdSchema, { id })

    const plan = await strapi.plugin('stripe-payment').service('plan').getPlanById({ id })

    if (!plan) {
      throw new errors.NotFoundError(`Plan with ID ${id} not found`)
    }

    ctx.send(plan)
  },

  async getPlans(ctx) {
    const products = await strapi.plugin('stripe-payment').service('plan').getPlans()
    ctx.send(products)
  },

  async delete(ctx) {
    const { id } = ctx.params as DeletePlanParams

    await validateWithYupSchema(deletePlanSchema, { id })

    const result = await strapi.plugin('stripe-payment').service('plan').delete({ id })

    if (!result) {
      throw new errors.NotFoundError(`Plan with ID ${id} not found`)
    }

    ctx.send(result)
  }
}))
