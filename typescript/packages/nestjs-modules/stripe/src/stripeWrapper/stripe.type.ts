import Stripe from 'stripe'

export type StripeEvent = Stripe.Event
export type StripeResponse<T> = Stripe.Response<T>
