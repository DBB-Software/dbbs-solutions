import Stripe from 'stripe'
import { ICreateSessionParams } from '../interfaces/index.js'
import { SessionMode } from '../enums/sessionMode.js'
import { PlanType } from '../enums/planType.js'

// Product

export const defaultProduct = {
  id: 'prod_1',
  lastResponse: { headers: {}, requestId: 'req_empty', statusCode: 200 }
} as Stripe.Product & { lastResponse: { headers: Record<string, string>; requestId: string; statusCode: number } }

export const deletedProduct: Stripe.DeletedProduct & {
  lastResponse: { headers: Record<string, string>; requestId: string; statusCode: number }
} = {
  id: '',
  object: 'product',
  deleted: true,
  lastResponse: { headers: {}, requestId: 'req_empty', statusCode: 200 }
}

export const productMocks = [
  {
    id: 'prod_2',
    name: 'Product 1'
  },
  {
    id: 'prod_3',
    name: 'Product 2'
  }
] as Stripe.Product[]

export const productListMock = {
  object: 'list',
  data: productMocks,
  has_more: false,
  url: '/v1/products',
  lastResponse: {
    headers: {},
    requestId: 'req_123',
    statusCode: 200
  }
} as Stripe.ApiList<Stripe.Product> & {
  lastResponse: { headers: Record<string, string>; requestId: string; statusCode: number }
}

// Customer

export const defaultCustomer = {
  id: 'cus_1',
  lastResponse: { headers: {}, requestId: 'req_empty', statusCode: 200 }
} as Stripe.Customer & {
  lastResponse: { headers: Record<string, string>; requestId: string; statusCode: number }
}

// Plan

export const defaultPlan = {
  id: 'plan_1',
  lastResponse: { headers: {}, requestId: 'req_empty', statusCode: 200 }
} as Stripe.Price & {
  lastResponse: { headers: Record<string, string>; requestId: string; statusCode: number }
}

export const planListMock: Stripe.ApiList<Stripe.Price> & {
  lastResponse: { headers: Record<string, string>; requestId: string; statusCode: number }
} = {
  object: 'list',
  data: [defaultPlan],
  has_more: false,
  url: '/v1/prices',
  lastResponse: {
    headers: {},
    requestId: 'req_123',
    statusCode: 200
  }
}

export const deletedPlan: Stripe.Price & {
  lastResponse: { headers: Record<string, string>; requestId: string; statusCode: number }
} = {
  ...defaultPlan,
  active: false
}

// Subscription

export const createSessionParamsMock = (params: {
  mode: SessionMode
  planType: PlanType
  customerId?: string
}): ICreateSessionParams => {
  const { mode, planType, customerId } = params

  const sessionParams: ICreateSessionParams = {
    success_url: 'https://example.com/success',
    metadata: {
      organizationName: 'Org Name',
      quantity: 1,
      userId: 1,
      planId: 1
    },
    line_items: [
      {
        price: 'price_1',
        quantity: 1
      }
    ],
    mode,
    customer: customerId || undefined
  }

  if (planType === PlanType.RECURRING) {
    sessionParams.subscription_data = {
      trial_period_days: 30
    }

    sessionParams.mode = SessionMode.SUBSCRIPTION
  }

  return sessionParams
}

export const defaultCheckoutSession = {
  id: 'cs_1',
  lastResponse: { headers: {}, requestId: 'req_empty', statusCode: 200 }
} as Stripe.Checkout.Session & {
  lastResponse: { headers: Record<string, string>; requestId: string; statusCode: number }
}

export const defaultSubscription = {
  id: 'sub_1',
  items: {
    data: [
      {
        id: 'si_1',
        price: { id: 'price_1' },
        quantity: 2
      } as Stripe.SubscriptionItem
    ]
  } as Stripe.ApiList<Stripe.SubscriptionItem>,
  lastResponse: { headers: {}, requestId: 'req_empty', statusCode: 200 }
} as Stripe.Subscription & {
  lastResponse: { headers: Record<string, string>; requestId: string; statusCode: number }
}

export const subscriptionListMock = {
  object: 'list',
  data: [defaultSubscription],
  has_more: false,
  url: '/v1/subscriptions',
  lastResponse: {
    headers: {},
    requestId: 'req_123',
    statusCode: 200
  }
} as Stripe.ApiList<Stripe.Subscription> & {
  lastResponse: { headers: Record<string, string>; requestId: string; statusCode: number }
}

// Organization

export const defaultOrganization = {
  id: 'org_1',
  name: 'Test Organization',
  email: 'test@org.com',
  lastResponse: { headers: {}, requestId: 'req_empty', statusCode: 200 }
} as Stripe.Customer & {
  lastResponse: { headers: Record<string, string>; requestId: string; statusCode: number }
}

export const deletedOrganization: Stripe.DeletedCustomer & {
  lastResponse: { headers: Record<string, string>; requestId: string; statusCode: number }
} = {
  ...defaultOrganization,
  deleted: true
}

type StripeResources = {
  checkoutSessions: Stripe.Checkout.SessionsResource
  customers: Stripe.CustomersResource
  subscriptions: Stripe.SubscriptionsResource
  products: Stripe.ProductsResource
  prices: Stripe.PricesResource
}
export type ResourceName = keyof StripeResources
export type ResourceMethods<T extends ResourceName> = keyof StripeResources[T]

export const getMockedMethod = <T extends ResourceName>(
  stripeMock: Stripe,
  resourceName: T,
  methodName: ResourceMethods<T>
) => {
  const resource =
    resourceName === 'checkoutSessions'
      ? stripeMock.checkout.sessions
      : stripeMock[resourceName as Exclude<T, 'checkoutSessions'>]
  return resource[methodName as keyof typeof resource]
}
