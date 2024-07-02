import { Strapi } from '@strapi/strapi'

export default ({ strapi }: { strapi: Strapi }) => ({
  async handleEvent(ctx) {
    const { stripeEvent } = ctx.state

    const response = await strapi.plugin('stripe-payment').service('webhook').handleEvent(stripeEvent)
    ctx.send(response)
  }
})
