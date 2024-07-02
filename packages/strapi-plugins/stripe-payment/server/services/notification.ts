import Stripe from 'stripe'
import { Strapi } from '@strapi/strapi'
import { CustomSesHandler } from '@dbbs/common'

export default ({ strapi }: { strapi: Strapi }) => {
  const awsRegion: string = strapi.config.get('server.stripe.awsRegion')

  if (!awsRegion) {
    throw new Error('awsRegion is not defined')
  }

  return new CustomSesHandler(awsRegion)
}
