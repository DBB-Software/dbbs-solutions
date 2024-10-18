import { factories, Strapi } from '@strapi/strapi'
import { errors } from '@strapi/utils'
import { CreateProductParams, DeleteProductParams, GetProductByIdParams, UpdateProductParams } from '../interfaces'
import {
  createProductSchema,
  getProductByIdSchema,
  updateProductSchema,
  deleteProductSchema
} from '../validationSchemas'
import { validateWithYupSchema } from '../helpers'

export default factories.createCoreController('plugin::stripe-payment.product', ({ strapi }: { strapi: Strapi }) => ({
  async create(ctx) {
    const { name } = ctx.request.body as CreateProductParams

    await validateWithYupSchema(createProductSchema, {
      name
    })

    const product = await strapi.plugin('stripe-payment').service('product').create({
      name
    })
    ctx.send(product)
  },

  async getProductById(ctx) {
    const { id } = ctx.params as GetProductByIdParams

    await validateWithYupSchema(getProductByIdSchema, { id })

    const product = await strapi.plugin('stripe-payment').service('product').getProductById({ id })

    if (!product) {
      throw new errors.NotFoundError(`Product with ID ${id} not found`)
    }

    ctx.send(product)
  },

  async getProducts(ctx) {
    const products = await strapi.plugin('stripe-payment').service('product').getProducts()
    ctx.send(products)
  },

  async update(ctx) {
    const { id } = ctx.params
    const { name } = ctx.request.body as Omit<UpdateProductParams, 'id'>

    await validateWithYupSchema(updateProductSchema, { id, name })

    const product = await strapi.plugin('stripe-payment').service('product').update({
      id,
      name
    })

    if (!product) {
      throw new errors.NotFoundError(`Product with ID ${id} not found`)
    }

    ctx.send(product)
  },

  async delete(ctx) {
    const { id } = ctx.params as DeleteProductParams

    await validateWithYupSchema(deleteProductSchema, { id })

    const result = await strapi.plugin('stripe-payment').service('product').delete({ id })

    if (!result) {
      throw new errors.NotFoundError(`Product with ID ${id} not found`)
    }

    ctx.send(result)
  }
}))
