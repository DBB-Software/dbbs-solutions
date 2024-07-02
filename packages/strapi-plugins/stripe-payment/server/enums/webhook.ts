export enum StripeEventType {
  CheckoutSessionCompleted = 'checkout.session.completed',
  CustomerSubscriptionCreated = 'customer.subscription.created',
  CustomerSubscriptionUpdated = 'customer.subscription.updated',
  InvoicePaymentSucceeded = 'invoice.payment_succeeded',
  InvoicePaymentFailed = 'invoice.payment_failed',
  PaymentMethodAttached = 'payment_method.attached'
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
