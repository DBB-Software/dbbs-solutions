import extractUserMiddleware from '../middlewares/extractUser.middleware'
import checkSubscriptionOwnerMiddleware from '../middlewares/checkSubscriptionOwner.middleware'

export default [
  {
    method: 'POST',
    path: '/subscriptions/checkout-session',
    handler: 'subscription.createCheckoutSession',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware]
    }
  },
  {
    method: 'GET',
    path: '/subscriptions/my',
    handler: 'subscription.getMySubscription',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware]
    }
  },
  {
    method: 'GET',
    path: '/subscriptions',
    handler: 'subscription.getSubscriptions',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware]
    }
  },
  {
    method: 'PATCH',
    path: '/subscriptions/:id/pause',
    handler: 'subscription.pauseSubscription',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkSubscriptionOwnerMiddleware]
    }
  },
  {
    method: 'PATCH',
    path: '/subscriptions/:id/cancel',
    handler: 'subscription.cancelSubscription',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkSubscriptionOwnerMiddleware]
    }
  },
  {
    method: 'PATCH',
    path: '/subscriptions/:id/resume',
    handler: 'subscription.resumeSubscription',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkSubscriptionOwnerMiddleware]
    }
  },
  {
    method: 'DELETE',
    path: '/subscriptions/:id',
    handler: 'subscription.delete',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkSubscriptionOwnerMiddleware]
    }
  },
  {
    method: 'PATCH',
    path: '/subscriptions/:id/update',
    handler: 'subscription.updateStripeSubscription',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkSubscriptionOwnerMiddleware]
    }
  },
  {
    method: 'PATCH',
    path: '/subscriptions/:id/resubscribe',
    handler: 'subscription.resubscribe',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkSubscriptionOwnerMiddleware]
    }
  }
]
