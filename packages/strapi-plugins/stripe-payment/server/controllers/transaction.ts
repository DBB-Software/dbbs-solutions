/**
 *  controller
 */

import { factories, Strapi } from '@strapi/strapi'
import { errors } from '@strapi/utils'

export default factories.createCoreController(
  'plugin::stripe-payment.transaction',
  ({ strapi }: { strapi: Strapi }) => ({
    async getAllTransactions(ctx) {
      const { user } = ctx.state

      const paymentTransactions = await strapi.plugin('stripe-payment').service('transaction').getAllTransactions({
        userId: user.id
      })

      if (!paymentTransactions) {
        throw new errors.NotFoundError(`Organization with ownerId ${user.id} was not found`)
      }

      ctx.send(paymentTransactions)
    }
  })
)
