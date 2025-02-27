import Stripe from 'stripe'

export type StripeEvent = Stripe.Event
export type StripeResponse<T> = Stripe.Response<T>

export type StripeSubscriptionStatus =
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'paused'
