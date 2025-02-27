import Stripe from 'stripe'
import createHttpError from 'http-errors'

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
    throw new createHttpError.Forbidden()
  }

  ctx.state.stripeEvent = event

  return next()
}

export default stripeWebhookMiddleware
