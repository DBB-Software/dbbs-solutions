import createHttpError from 'http-errors'
import { factories, Strapi } from '@strapi/strapi'
import { CreatePlanParams, DeletePlanParams, GetPlanByIdParams } from '../interfaces'
import { createPlanSchema, deletePlanSchema, getPlanByIdSchema } from '../validationSchemas'
import { validateWithYupSchema } from '../helpers'

export default factories.createCoreController('plugin::stripe-payment.plan', ({ strapi }: { strapi: Strapi }) => ({
  async create(ctx) {
    const { price, interval, productId, type } = ctx.request.body as CreatePlanParams

    const validatedParams = await validateWithYupSchema(createPlanSchema, {
      price,
      interval,
      productId,
      type
    })

    const plan = await strapi.plugin('stripe-payment').service('plan').create(validatedParams)
    ctx.send(plan)
  },

  async getPlanById(ctx) {
    const { id } = ctx.params as GetPlanByIdParams

    const validatedParams = await validateWithYupSchema(getPlanByIdSchema, { id })

    const plan = await strapi.plugin('stripe-payment').service('plan').getPlanById(validatedParams)

    if (!plan) {
      throw new createHttpError.NotFound(`Plan with ID ${id} not found`)
    }

    ctx.send(plan)
  },

  async getPlans(ctx) {
    const products = await strapi.plugin('stripe-payment').service('plan').getPlans()
    ctx.send(products)
  },

  async delete(ctx) {
    const { id } = ctx.params as DeletePlanParams

    const validatedParams = await validateWithYupSchema(deletePlanSchema, { id })

    const result = await strapi.plugin('stripe-payment').service('plan').delete(validatedParams)

    if (!result) {
      throw new createHttpError.NotFound(`Plan with ID ${id} not found`)
    }

    ctx.send(result)
  }
}))
