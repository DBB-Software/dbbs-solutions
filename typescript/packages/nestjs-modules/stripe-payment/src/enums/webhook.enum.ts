export enum StripeEventType {
  ProductCreated = 'product.created',
  ProductUpdated = 'product.updated',
  ProductDeleted = 'product.deleted',
  PriceCreated = 'price.created',
  PriceUpdated = 'price.updated',
  PriceDeleted = 'price.deleted',
  CheckoutSessionCompleted = 'checkout.session.completed',
  InvoicePaymentSucceeded = 'invoice.payment_succeeded',
  InvoicePaymentFailed = 'invoice.payment_failed',
  CustomerSubscriptionUpdated = 'customer.subscription.updated'
}

export enum BillingReason {
  Manual = 'manual',
  Subscription = 'subscription',
  Subscription_create = 'subscription_create',
  Subscription_cycle = 'subscription_cycle',
  Subscription_threshold = 'subscription_threshold',
  Subscription_update = 'subscription_update',
  Upcoming = 'upcoming'
}
