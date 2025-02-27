import { factories, Strapi } from '@strapi/strapi'
import { GetAllPurchasesParams } from '../interfaces'

export default factories.createCoreService('plugin::stripe-payment.purchase', ({ strapi }: { strapi: Strapi }) => ({
  async getAllTransactions(params: GetAllPurchasesParams) {
    const { organizationId } = params

    const organization = await strapi.query('plugin::stripe-payment.organization').findOne({
      where: {
        id: organizationId
      },
      populate: {
        transactions: true
      }
    })

    if (!organization) {
      return null
    }

    return strapi.query('plugin::stripe-payment.purchase').findMany({
      where: {
        organization: organization.id
      },
      populate: {
        plan: true
      }
    })
  }
}))
