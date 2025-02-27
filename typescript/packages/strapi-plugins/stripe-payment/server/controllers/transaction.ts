/**
 *  controller
 */

import createHttpError from 'http-errors'
import { factories, Strapi } from '@strapi/strapi'

export default factories.createCoreController(
  'plugin::stripe-payment.transaction',
  ({ strapi }: { strapi: Strapi }) => ({
    async getAllTransactions(ctx) {
      const { user } = ctx.state

      const paymentTransactions = await strapi.plugin('stripe-payment').service('transaction').getAllTransactions({
        userId: user.id
      })

      if (!paymentTransactions) {
        throw new createHttpError.NotFound(`Organization with ownerId ${user.id} was not found`)
      }

      ctx.send(paymentTransactions)
    }
  })
)
