export enum StripeEventType {
  CheckoutSessionCompleted = 'checkout.session.completed',
  CustomerSubscriptionCreated = 'customer.subscription.created',
  CustomerSubscriptionUpdated = 'customer.subscription.updated',
  InvoicePaymentSucceeded = 'invoice.payment_succeeded',
  InvoicePaymentFailed = 'invoice.payment_failed',
  PaymentMethodAttached = 'payment_method.attached',
  PriceDeleted = 'price.deleted',
  PriceUpdated = 'price.updated',
  PriceCreated = 'price.created',
  ProductCreated = 'product.created',
  ProductUpdated = 'product.updated',
  ProductDeleted = 'product.deleted',
  SetupIntentSucceeded = 'setup_intent.succeeded'
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

export enum PaymentMode {
  Payment = 'payment',
  Setup = 'setup',
  Subscription = 'subscription'
}
