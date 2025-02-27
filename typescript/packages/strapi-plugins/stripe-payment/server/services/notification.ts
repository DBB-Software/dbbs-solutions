import { Strapi } from '@strapi/strapi'

import { SendgridService } from './sendgrid'

export default ({ strapi }: { strapi: Strapi }) => {
  const sendgridApiKey: string = strapi.config.get('server.sendgrid.apiKey')
  const verifiedEmail: string = strapi.config.get('server.sendgrid.verifiedEmail')

  if (!sendgridApiKey || !verifiedEmail) {
    throw new Error('sendgridApiKey or verifiedEmail is not defined')
  }

  return new SendgridService(sendgridApiKey, verifiedEmail)
}
