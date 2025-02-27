import Stripe from 'stripe'

export interface StripeProduct extends Stripe.Product {}
export interface StripePrice extends Stripe.Price {}
export interface StripeSubscription extends Stripe.Subscription {}
export interface StripeInvoice extends Stripe.Invoice {}
export interface StripePaymentIntent extends Stripe.PaymentIntent {}
export interface StripeCheckoutSession extends Stripe.Checkout.Session {}
export interface StripeProductCreatedEvent extends Stripe.ProductCreatedEvent {}
export interface StripeProductUpdatedEvent extends Stripe.ProductUpdatedEvent {}
export interface StripeProductDeletedEvent extends Stripe.ProductDeletedEvent {}
export interface StripePriceCreatedEvent extends Stripe.PriceCreatedEvent {}
export interface StripePriceUpdatedEvent extends Stripe.PriceUpdatedEvent {}
export interface StripePriceDeletedEvent extends Stripe.PriceDeletedEvent {}
export interface StripeCheckoutSessionCompletedEvent extends Stripe.CheckoutSessionCompletedEvent {}
export interface StripeInvoicePaymentSucceededEvent extends Stripe.InvoicePaymentSucceededEvent {}
export interface StripeInvoicePaymentFailedEvent extends Stripe.InvoicePaymentFailedEvent {}
export interface StripeCustomer extends Stripe.Customer {}
export interface StripeCustomerSubscriptionUpdatedEvent extends Stripe.CustomerSubscriptionUpdatedEvent {}
