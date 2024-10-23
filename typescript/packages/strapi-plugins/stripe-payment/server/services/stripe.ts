import Stripe from 'stripe'
import { Strapi } from '@strapi/strapi'

export default ({ strapi }: { strapi: Strapi }) => {
  const stripeApiKey: string = strapi.config.get('server.stripe.apiKey')

  if (!stripeApiKey) {
    throw new Error('stripeApiKey is not defined')
  }

  return new Stripe(stripeApiKey, {
    apiVersion: '2024-04-10'
  })
}
