import Stripe from 'stripe'

export interface StripeProduct extends Stripe.Product {}
export interface StripePrice extends Stripe.Price {}
export interface StripeSubscription extends Stripe.Subscription {}
export interface StripeProductCreatedEvent extends Stripe.ProductCreatedEvent {}
export interface StripeProductUpdatedEvent extends Stripe.ProductUpdatedEvent {}
export interface StripeProductDeletedEvent extends Stripe.ProductDeletedEvent {}
export interface StripePriceCreatedEvent extends Stripe.PriceCreatedEvent {}
export interface StripePriceUpdatedEvent extends Stripe.PriceUpdatedEvent {}
export interface StripePriceDeletedEvent extends Stripe.PriceDeletedEvent {}
