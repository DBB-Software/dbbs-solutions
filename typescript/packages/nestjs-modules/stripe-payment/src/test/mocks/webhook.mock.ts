import {
  StripePriceCreatedEvent,
  StripePriceDeletedEvent,
  StripePriceUpdatedEvent,
  StripeProductCreatedEvent,
  StripeProductDeletedEvent,
  StripeProductUpdatedEvent
} from '@dbbs/nestjs-module-stripe'
import { BillingPeriod, PlanType, StripeEventType } from '../../enums/index.js'

export const productCreatedStripeEvent = {
  type: StripeEventType.ProductCreated,
  data: {
    object: { id: 'prod_1', name: 'Product 1' }
  }
} as StripeProductCreatedEvent

export const productUpdatedStripeEvent = {
  type: StripeEventType.ProductUpdated,
  data: {
    object: { id: 'prod_1', name: 'Updated Product Name' }
  }
} as StripeProductUpdatedEvent

export const productDeletedStripeEvent = {
  type: StripeEventType.ProductDeleted,
  data: {
    object: { id: 'prod_1', name: 'Product 1' }
  }
} as StripeProductDeletedEvent

export const priceCreatedStripeEvent = {
  type: StripeEventType.PriceCreated,
  data: {
    object: {
      id: 'plan_1',
      product: 'prod_1',
      recurring: { interval: BillingPeriod.MONTH },
      type: PlanType.RECURRING,
      unit_amount: 100000
    }
  }
} as StripePriceCreatedEvent

export const priceUpdatedStripeEvent = {
  type: StripeEventType.PriceUpdated,
  data: {
    object: {
      id: 'plan_1',
      recurring: null,
      type: PlanType.ONE_TIME,
      unit_amount: 150000
    }
  }
} as StripePriceUpdatedEvent

export const priceDeletedStripeEvent = {
  type: StripeEventType.PriceDeleted,
  data: {
    object: {
      id: 'plan_1'
    }
  }
} as StripePriceDeletedEvent

export const nonExistingStripeEvent = { type: 'non_existing_event' }
