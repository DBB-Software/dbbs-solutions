import extractUserMiddleware from '../../middlewares/extractUser.middleware'
import checkSubscriptionOwnerMiddleware from '../../middlewares/checkSubscriptionOwner.middleware'

export default [
  {
    method: 'POST',
    path: '/api/subscriptions/checkout-session',
    handler: 'subscription.createCheckoutSession',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware]
    }
  },
  {
    method: 'GET',
    path: '/api/subscriptions/my',
    handler: 'subscription.getMySubscription',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware]
    }
  },
  {
    method: 'GET',
    path: '/api/subscriptions/:id',
    handler: 'subscription.getSubscriptionById',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkSubscriptionOwnerMiddleware]
    }
  },
  {
    method: 'GET',
    path: '/api/subscriptions',
    handler: 'subscription.getSubscriptions',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware]
    }
  },
  {
    method: 'PATCH',
    path: '/api/subscriptions/:id/pause',
    handler: 'subscription.pauseSubscription',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkSubscriptionOwnerMiddleware]
    }
  },
  {
    method: 'PATCH',
    path: '/api/subscriptions/:id/cancel',
    handler: 'subscription.cancelSubscription',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkSubscriptionOwnerMiddleware]
    }
  },
  {
    method: 'PATCH',
    path: '/api/subscriptions/:id/resume',
    handler: 'subscription.resumeSubscription',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkSubscriptionOwnerMiddleware]
    }
  },
  {
    method: 'DELETE',
    path: '/api/subscriptions/:id',
    handler: 'subscription.delete',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkSubscriptionOwnerMiddleware]
    }
  },
  {
    method: 'PATCH',
    path: '/api/subscriptions/:id/update',
    handler: 'subscription.updateStripeSubscription',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkSubscriptionOwnerMiddleware]
    }
  },
  {
    method: 'PATCH',
    path: '/api/subscriptions/:id/resubscribe',
    handler: 'subscription.resubscribe',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkSubscriptionOwnerMiddleware]
    }
  }
]
