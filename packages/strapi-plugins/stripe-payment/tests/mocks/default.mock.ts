import { defaultOrganization, updatedOrganization } from './organization.mock'
import { defaultPlan } from './plan.mock'
import { defaultProduct, updatedProduct } from './product.mock'
import { canceledSubscription, defaultSubscription, updatedSubscription } from './subscription.mock'

export const strapiOrganizationControllerMock = {
  plugin: jest.fn().mockReturnValue({
    service: jest.fn().mockReturnValue({
      create: jest.fn().mockResolvedValue(defaultOrganization),
      getOrganizationById: jest.fn().mockResolvedValue(defaultOrganization),
      getOrganizations: jest.fn().mockResolvedValue([defaultOrganization]),
      update: jest.fn().mockResolvedValue(updatedOrganization),
      delete: jest.fn().mockResolvedValue({ id: 1 }),
      updateOwner: jest.fn().mockResolvedValue({ id: 1, name: 'Test Organization', owner_id: 2 }),
      addUser: jest.fn().mockResolvedValue({ id: 1, name: 'Test Organization', users: [{ id: 2, username: 'user2' }] }),
      removeUser: jest.fn().mockResolvedValue({ id: 1, name: 'Test Organization', users: [] })
    })
  })
}

export const strapiPlanControllerMock = {
  plugin: jest.fn().mockReturnValue({
    service: jest.fn().mockReturnValue({
      create: jest.fn().mockResolvedValue(defaultPlan),
      getPlanById: jest.fn().mockResolvedValue(defaultPlan),
      getPlans: jest.fn().mockResolvedValue([defaultPlan])
    })
  })
}

export const strapiProductControllerMock = {
  plugin: jest.fn().mockReturnValue({
    service: jest.fn().mockReturnValue({
      create: jest.fn().mockResolvedValue(defaultProduct),
      getProductById: jest.fn().mockResolvedValue(defaultProduct),
      getProducts: jest.fn().mockResolvedValue([defaultProduct]),
      update: jest.fn().mockResolvedValue(updatedProduct),
      delete: jest.fn().mockResolvedValue({ id: 1 })
    })
  })
}

export const strapiSubscriptionControllerMock = {
  plugin: jest.fn().mockReturnValue({
    service: jest.fn().mockReturnValue({
      createCheckoutSession: jest.fn().mockResolvedValue('https://checkout.session.url'),
      getSubscriptionById: jest.fn().mockResolvedValue(defaultSubscription),
      getMySubscription: jest.fn().mockResolvedValue([defaultSubscription]),
      getSubscriptions: jest.fn().mockResolvedValue([defaultSubscription]),
      cancelSubscription: jest.fn().mockResolvedValue(true),
      pauseSubscription: jest.fn().mockResolvedValue(updatedSubscription),
      resumeSubscription: jest.fn().mockResolvedValue(defaultSubscription),
      updateStripeSubscription: jest.fn().mockResolvedValue({ id: 1, quantity: 1, planId: 1 }),
      resubscribe: jest.fn().mockResolvedValue(true)
    })
  })
}

export const defaultQueryMock = {
  create: jest.fn(),
  findOne: jest.fn(),
  findMany: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}

export const strapiOrganizationServiceMock = {
  query: jest.fn().mockReturnValue(defaultQueryMock),
  plugin: jest.fn().mockReturnValue({
    service: jest.fn().mockReturnValue({
      customers: {
        create: jest.fn().mockResolvedValue({ id: 'cus_123', name: 'Test Organization' }),
        del: jest.fn().mockResolvedValue({ id: 'cus_123', deleted: true })
      },
      subscriptions: {
        retrieve: jest.fn().mockResolvedValue({ id: 'sub_123', items: { data: [{ quantity: 2 }] } })
      }
    })
  }),
  config: {
    get: jest.fn().mockReturnValue('fake-stripe-key'),
    set: jest.fn(),
    has: jest.fn()
  }
}

export const strapiSubscriptionServiceMock = {
  query: jest.fn().mockReturnValue(defaultQueryMock),
  plugin: jest.fn().mockReturnValue({
    service: jest.fn().mockReturnValue({
      checkout: {
        sessions: {
          create: jest.fn().mockResolvedValue({ url: 'https://checkout.session.url' })
        }
      },
      subscriptions: {
        cancel: jest.fn().mockResolvedValue(canceledSubscription),
        update: jest.fn().mockResolvedValue(updatedSubscription),
        retrieve: jest.fn().mockResolvedValue({
          id: 'sub_123',
          items: {
            data: [{ id: 'item_123', price: { id: 'price_123' }, quantity: 1 }]
          }
        }),
        create: jest.fn().mockResolvedValue(defaultSubscription)
      }
    })
  }),
  config: {
    get: jest.fn().mockReturnValue('https://success.url'),
    set: jest.fn(),
    has: jest.fn()
  }
}

export const strapiProductServiceMock = {
  query: jest.fn().mockReturnValue(defaultQueryMock),
  plugin: jest.fn().mockReturnValue({
    service: jest.fn().mockReturnValue({
      products: {
        create: jest.fn().mockResolvedValue(defaultProduct),
        list: jest.fn().mockResolvedValue({ data: [defaultProduct] }),
        del: jest.fn().mockResolvedValue({ id: 'prod_123', deleted: true }),
        update: jest.fn().mockResolvedValue(updatedProduct)
      }
    })
  }),
  config: {
    get: jest.fn().mockReturnValue('fake-stripe-key'),
    set: jest.fn(),
    has: jest.fn()
  }
}

export const strapiPlanServiceMock = {
  query: jest.fn().mockReturnValue(defaultQueryMock),
  plugin: jest.fn().mockReturnValue({
    service: jest.fn().mockReturnValue({
      prices: {
        create: jest.fn().mockResolvedValue(defaultPlan)
      }
    })
  }),
  config: {
    get: jest.fn().mockReturnValue('usd'),
    set: jest.fn(),
    has: jest.fn()
  }
}
