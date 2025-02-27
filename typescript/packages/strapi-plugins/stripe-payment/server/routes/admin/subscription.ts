export default [
  {
    method: 'GET',
    path: '/admin/subscriptions/:id',
    handler: 'subscription.getSubscriptionById',
    config: {}
  },
  {
    method: 'GET',
    path: '/admin/subscriptions',
    handler: 'subscription.getSubscriptions',
    config: {}
  },
  {
    method: 'PATCH',
    path: '/admin/subscriptions/:id/pause',
    handler: 'subscription.pauseSubscription',
    config: {}
  },
  {
    method: 'PATCH',
    path: '/admin/subscriptions/:id/cancel',
    handler: 'subscription.cancelSubscription',
    config: {}
  },
  {
    method: 'PATCH',
    path: '/admin/subscriptions/:id/resume',
    handler: 'subscription.resumeSubscription',
    config: {}
  },
  {
    method: 'DELETE',
    path: '/admin/subscriptions/:id',
    handler: 'subscription.delete',
    config: {}
  },
  {
    method: 'PATCH',
    path: '/admin/subscriptions/:id',
    handler: 'subscription.updateStripeSubscription',
    config: {}
  },
  {
    method: 'PATCH',
    path: '/admin/subscriptions/:id/resubscribe',
    handler: 'subscription.resubscribe',
    config: {}
  }
]
