import Stripe from 'stripe'
import { factories, Strapi } from '@strapi/strapi'
import createHttpError from 'http-errors'
import { CreateProductParams, DeleteProductParams, GetProductByIdParams, UpdateProductParams } from '../interfaces'

export default factories.createCoreService('plugin::stripe-payment.product', ({ strapi }: { strapi: Strapi }) => ({
  async create(params: CreateProductParams) {
    const { name } = params

    const product = await strapi.plugin('stripe-payment').service('stripe').products.create({
      name
    })

    const savedProduct = await strapi.query('plugin::stripe-payment.product').create({
      data: {
        name,
        stripe_id: product.id
      }
    })

    return savedProduct
  },

  async getProductById(params: GetProductByIdParams) {
    const { id } = params

    const product = await strapi.query('plugin::stripe-payment.product').findOne({
      where: { id },
      populate: ['plans']
    })

    return product
  },

  async getProducts() {
    const stripeProducts = await strapi.plugin('stripe-payment').service('stripe').products.list()
    const stripeProductIds = stripeProducts.data.map((product: Stripe.Product) => product.id)

    const products = await strapi.query('plugin::stripe-payment.product').findMany({
      where: {
        stripe_id: {
          $in: stripeProductIds
        }
      },
      populate: ['plans']
    })

    return products
  },

  async update(params: UpdateProductParams) {
    const { name, id } = params

    const product = await strapi.query('plugin::stripe-payment.product').findOne({ where: { id } })

    if (!product) {
      return null
    }

    await strapi.plugin('stripe-payment').service('stripe').products.update(product.stripe_id, {
      name
    })

    const updatedProduct = await strapi.query('plugin::stripe-payment.product').update({
      where: { id },
      data: {
        name
      }
    })

    return updatedProduct
  },

  async delete(params: DeleteProductParams) {
    const { id } = params
    const product = await strapi.query('plugin::stripe-payment.product').findOne({
      where: { id },
      populate: {
        plans: true
      }
    })

    if (!product) {
      return null
    }

    if (product.plans && product.plans.length > 0) {
      throw new createHttpError.BadRequest('You cannot delete a product with plans')
    }

    await strapi.plugin('stripe-payment').service('stripe').products.del(product.stripe_id)
    await strapi.query('plugin::stripe-payment.product').delete({ where: { id } })

    return { id }
  }
}))
