import { Strapi } from '@strapi/strapi'

export default ({ strapi }: { strapi: Strapi }) => ({
  async getUsers(ctx) {
    const users = await strapi.plugin('stripe-payment').service('user').getUsers()
    ctx.send(users)
  }
})
