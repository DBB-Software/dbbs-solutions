/**
 *  controller
 */

import { factories, Strapi } from '@strapi/strapi'
import createHttpError from 'http-errors'

export default factories.createCoreController('plugin::stripe-payment.purchase', ({ strapi }: { strapi: Strapi }) => ({
  async getAllPurchases(ctx) {
    const { id } = ctx.params

    const purchases = await strapi.plugin('stripe-payment').service('purchase').getAllPurchases({
      organizationId: id
    })

    if (!purchases) {
      throw new createHttpError.NotFound(`Purchases are not found`)
    }

    ctx.send(purchases)
  }
}))
