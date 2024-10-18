import { factories, Strapi } from '@strapi/strapi'
import { GetAllTransactionsParams } from '../interfaces'

export default factories.createCoreService('plugin::stripe-payment.transaction', ({ strapi }: { strapi: Strapi }) => ({
  async getAllTransactions(params: GetAllTransactionsParams) {
    const { userId } = params

    const organization = await strapi.query('plugin::stripe-payment.organization').findOne({
      where: {
        owner_id: userId
      },
      populate: {
        transactions: true
      }
    })

    if (!organization) {
      return null
    }

    const paymentTransactions = await strapi.query('plugin::stripe-payment.transaction').findMany({
      where: {
        organization: organization.id
      }
    })

    return paymentTransactions
  }
}))
