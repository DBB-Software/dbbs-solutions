import { errors } from '@strapi/utils'
import Stripe from 'stripe'
import { Strapi } from '@strapi/strapi'

const stripeWebhookMiddleware = async (ctx, next) => {
  const stripeWebhookSecret: string = strapi.config.get('server.stripe.webhookSecret')
  const {
    request: { body, headers }
  } = ctx

  const raw = body[Symbol.for('unparsedBody')]

  let event: Stripe.Event

  try {
    event = await strapi
      .plugin('stripe-payment')
      .service('stripe')
      .webhooks.constructEvent(raw, headers['stripe-signature'], stripeWebhookSecret)
  } catch (err) {
    console.log(err)
    throw new errors.ForbiddenError()
  }

  ctx.state.stripeEvent = event

  return next()
}

export default stripeWebhookMiddleware
