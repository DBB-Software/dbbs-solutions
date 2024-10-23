/**
 *  router
 */
import stripeWebhookMiddleware from '../../middlewares/stripeWebhook.middleware'

export default [
  {
    method: 'POST',
    path: '/api/webhook',
    handler: 'webhook.handleEvent',
    config: {
      auth: false,
      middlewares: [stripeWebhookMiddleware]
    }
  }
]
