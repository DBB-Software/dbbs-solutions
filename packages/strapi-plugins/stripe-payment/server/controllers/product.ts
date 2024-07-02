import { factories, Strapi } from '@strapi/strapi'
import { errors } from '@strapi/utils'
import { CreateProductParams, DeleteProductParams, GetProductByIdParams, UpdateProductParams } from '../interfaces'

// TODO: add types & validation
export default factories.createCoreController('plugin::stripe-payment.product', ({ strapi }: { strapi: Strapi }) => ({
  async create(ctx) {
    const data = ctx.request.body as CreateProductParams
    const product = await strapi.plugin('stripe-payment').service('product').create(data)
    ctx.send(product)
  },

  async getProductById(ctx) {
    const { id } = ctx.params as GetProductByIdParams
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
    const result = await strapi.plugin('stripe-payment').service('product').delete({ id })

    if (!result) {
      throw new errors.NotFoundError(`Product with ID ${id} not found`)
    }

    ctx.send(result)
  }
}))
