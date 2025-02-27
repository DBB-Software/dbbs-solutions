import {
  StripeCheckoutSessionCompletedEvent,
  StripeCustomerSubscriptionUpdatedEvent,
  StripeInvoicePaymentFailedEvent,
  StripeInvoicePaymentSucceededEvent,
  StripePriceCreatedEvent,
  StripePriceDeletedEvent,
  StripePriceUpdatedEvent,
  StripeProductCreatedEvent,
  StripeProductDeletedEvent,
  StripeProductUpdatedEvent
} from '@dbbs/nestjs-module-stripe'
import { BillingPeriod, BillingReason, PlanType, StripeEventType } from '../../enums/index.js'

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

export const defaultCheckoutSessionCompletedStripeEvent = {
  type: StripeEventType.CheckoutSessionCompleted,
  data: {
    object: {
      id: 'cs_1'
    }
  }
} as StripeCheckoutSessionCompletedEvent

export const setupCheckoutSessionCompletedEvent = {
  data: {
    object: {
      mode: 'setup'
    }
  }
} as StripeCheckoutSessionCompletedEvent

export const paymentCheckoutSessionCompletedEvent = {
  data: {
    object: {
      id: 'cs_test',
      mode: 'payment',
      customer: 'cus_test',
      invoice: 'inv_test'
    }
  }
} as StripeCheckoutSessionCompletedEvent

export const subscriptionCheckoutSessionCompletedEvent = {
  data: {
    object: {
      id: 'cs_test',
      mode: 'subscription',
      customer: 'cus_test',
      invoice: 'inv_test'
    }
  }
} as StripeCheckoutSessionCompletedEvent

export const defaultInvoicePaymentSucceededStripeEvent = {
  type: StripeEventType.InvoicePaymentSucceeded,
  data: {
    object: {
      id: 'inv_1'
    }
  }
} as StripeInvoicePaymentSucceededEvent

export const subscriptionCreateInvoicePaymentSucceededEvent = {
  data: {
    object: {
      billing_reason: BillingReason.Subscription_create
    }
  }
} as StripeInvoicePaymentSucceededEvent

export const noSubscriptionInvoicePaymentSucceededEvent = {
  data: {
    object: {
      billing_reason: BillingReason.Subscription,
      subscription: null
    }
  }
} as StripeInvoicePaymentSucceededEvent

export const subscriptionInvoicePaymentSucceededEvent = {
  data: {
    object: {
      id: 'inv_test',
      subscription: 'sub_1',
      billing_reason: BillingReason.Subscription
    }
  }
} as StripeInvoicePaymentSucceededEvent

export const defaultInvoicePaymentFailedStripeEvent = {
  type: StripeEventType.InvoicePaymentFailed,
  data: {
    object: {
      id: 'inv_1'
    }
  }
} as StripeInvoicePaymentFailedEvent

export const noSubscriptionInvoicePaymentFailedEvent = {
  data: {
    object: {
      subscription: null
    }
  }
} as StripeInvoicePaymentFailedEvent

export const subscriptionInvoicePaymentFailedEvent = {
  data: {
    object: {
      id: 'inv_test',
      subscription: 'sub_1'
    }
  }
} as StripeInvoicePaymentFailedEvent

export const trialingCustomerSubscriptionUpdatedEvent = {
  data: {
    object: {
      id: 'sub_test',
      status: 'trialing'
    }
  }
} as StripeCustomerSubscriptionUpdatedEvent

export const defaultCustomerSubscriptionUpdatedEvent = {
  data: {
    object: {
      id: 'sub_test',
      status: 'active',
      customer: 'cus_test',
      items: {
        data: [
          {
            quantity: 15,
            price: { id: 'price_test' }
          }
        ]
      }
    }
  }
} as StripeCustomerSubscriptionUpdatedEvent

export const canceledCustomerSubscriptionUpdatedEvent = {
  data: {
    object: {
      id: 'sub_test',
      status: 'canceled',
      customer: 'cus_test',
      items: {
        data: [
          {
            quantity: 15,
            price: { id: 'price_test' }
          }
        ]
      }
    }
  }
} as StripeCustomerSubscriptionUpdatedEvent

export const nonExistingStripeEvent = { type: 'non_existing_event' }
