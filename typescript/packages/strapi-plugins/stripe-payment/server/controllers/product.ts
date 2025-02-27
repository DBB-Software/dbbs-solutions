import createHttpError from 'http-errors'
import { factories, Strapi } from '@strapi/strapi'
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

    const validatedParams = await validateWithYupSchema(createProductSchema, {
      name
    })

    const product = await strapi.plugin('stripe-payment').service('product').create(validatedParams)
    ctx.send(product)
  },

  async getProductById(ctx) {
    const { id } = ctx.params as GetProductByIdParams

    const validatedParams = await validateWithYupSchema(getProductByIdSchema, { id })

    const product = await strapi.plugin('stripe-payment').service('product').getProductById(validatedParams)

    if (!product) {
      throw new createHttpError.NotFound(`Product with ID ${id} not found`)
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

    const validatedParams = await validateWithYupSchema(updateProductSchema, { id, name })

    const product = await strapi.plugin('stripe-payment').service('product').update(validatedParams)

    if (!product) {
      throw new createHttpError.NotFound(`Product with ID ${id} not found`)
    }

    ctx.send(product)
  },

  async delete(ctx) {
    const { id } = ctx.params as DeleteProductParams

    const validatedParams = await validateWithYupSchema(deleteProductSchema, { id })

    const result = await strapi.plugin('stripe-payment').service('product').delete(validatedParams)

    if (!result) {
      throw new createHttpError.NotFound(`Product with ID ${id} not found`)
    }

    ctx.send(result)
  }
}))
