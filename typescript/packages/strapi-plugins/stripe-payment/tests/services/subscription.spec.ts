import { Strapi } from '@strapi/strapi'
import subscriptionService from '../../server/services/subscription'
import { createMockStrapi } from '../factories'
import { PlanType, SubscriptionStatus } from '../../server/enums'
import { canceledSubscription, defaultSubscription, strapiSubscriptionServiceMock, updatedSubscription } from '../mocks'

jest.mock('stripe')

describe('Subscription Service', () => {
  let strapi: Strapi

  beforeEach(() => {
    strapi = createMockStrapi(strapiSubscriptionServiceMock)
  })

  describe('Create Checkout Session', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })
    it.each([
      {
        name: 'should create a checkout session',
        serviceMethodArgs: {
          organizationName: 'Test Organization',
          userId: 1,
          planId: 1,
          quantity: 1
        },
        expectedResult: 'https://checkout.session.url',
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.plan'), 'findOne').mockResolvedValue({
            id: 1,
            stripe_id: 'price_123',
            type: PlanType.RECURRING
          })
          jest.spyOn(strapi.query('plugin::stripe-payment.organization'), 'count').mockResolvedValue(0)
          jest.spyOn(strapi.plugin('stripe-payment').service('stripe').checkout.sessions, 'create').mockResolvedValue({
            url: 'https://checkout.session.url'
          })
        },
        stripeServiceMethod: 'create',
        stripeServiceArgs: [
          {
            success_url: 'https://success.url',
            metadata: {
              organizationName: 'Test Organization',
              userId: 1,
              planId: 1,
              quantity: 1
            },
            line_items: [{ price: 'price_123', quantity: 1 }],
            subscription_data: {
              trial_period_days: 30
            },
            mode: 'subscription'
          }
        ],
        queryMethod: 'findOne',
        queryArgs: { where: { id: 1 } }
      },
      {
        name: 'should create a checkout session',
        serviceMethodArgs: {
          userId: 1,
          planId: 1,
          quantity: 1,
          organizationId: 1
        },
        expectedResult: 'https://checkout.session.url',
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.plan'), 'findOne').mockResolvedValue({
            id: 1,
            stripe_id: 'price_123',
            type: PlanType.RECURRING
          })
          jest
            .spyOn(strapi.query('plugin::stripe-payment.organization'), 'findOne')
            .mockResolvedValue({ name: 'Test Organization', customer_id: 11 })
          jest.spyOn(strapi.plugin('stripe-payment').service('stripe').checkout.sessions, 'create').mockResolvedValue({
            url: 'https://checkout.session.url'
          })
        },
        stripeServiceMethod: 'create',
        customer: 11,
        stripeServiceArgs: [
          {
            success_url: 'https://success.url',
            customer: 11,
            metadata: {
              organizationName: 'Test Organization',
              userId: 1,
              planId: 1,
              quantity: 1
            },
            line_items: [{ price: 'price_123', quantity: 1 }],
            subscription_data: {
              trial_period_days: 30
            },
            mode: 'subscription'
          }
        ]
      }
    ])(
      '$name',
      async ({
        serviceMethodArgs,
        expectedResult,
        setupMocks,
        stripeServiceMethod,
        stripeServiceArgs,
        queryMethod,
        queryArgs
      }) => {
        setupMocks()

        const result = await subscriptionService({ strapi }).createCheckoutSession(serviceMethodArgs)

        if (stripeServiceMethod && stripeServiceArgs) {
          expect(
            strapi.plugin('stripe-payment').service('stripe').checkout.sessions[stripeServiceMethod]
          ).toBeCalledWith(...stripeServiceArgs)
        }

        if (queryMethod && queryArgs) {
          expect(strapi.query('plugin::stripe-payment.plan')[queryMethod]).toBeCalledWith(queryArgs)
        }

        expect(result).toEqual(expectedResult)
      }
    )
  })

  describe('Get Subscription By Id', () => {
    it.each([
      {
        name: 'should get a subscription by id',
        serviceMethodArgs: { id: 1 },
        expectedResult: defaultSubscription,
        setupMocks: () => {
          jest
            .spyOn(strapi.query('plugin::stripe-payment.subscription'), 'findOne')
            .mockResolvedValue(defaultSubscription)
        },
        queryMethod: 'findOne',
        queryArgs: { where: { id: 1 }, populate: { organization: true, plan: true } }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks, queryMethod, queryArgs }) => {
      setupMocks()

      const result = await subscriptionService({ strapi }).getSubscriptionById(serviceMethodArgs)

      if (queryMethod && queryArgs) {
        expect(strapi.query('plugin::stripe-payment.subscription')[queryMethod]).toBeCalledWith(queryArgs)
      }

      expect(result).toEqual(expectedResult)
    })

    it.each([
      {
        name: 'should return null if subscription by id is not found',
        serviceMethodArgs: { id: 1 },
        expectedResult: null,
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.subscription'), 'findOne').mockResolvedValue(null)
        },
        queryMethod: 'findOne',
        queryArgs: { where: { id: 1 }, populate: { organization: true, plan: true } },
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks, queryMethod, queryArgs }) => {
      setupMocks()

      const result = await subscriptionService({ strapi }).getSubscriptionById(serviceMethodArgs)

      if (queryMethod && queryArgs) {
        expect(strapi.query('plugin::stripe-payment.subscription')[queryMethod]).toBeCalledWith(queryArgs)
      }

      expect(result).toEqual(expectedResult)
    })
  })

  describe('Get My Subscription', () => {
    it.each([
      {
        name: 'should get my subscription',
        serviceMethodArgs: { userId: 1 },
        expectedResult: defaultSubscription,
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.organization'), 'findOne').mockResolvedValue({
            id: 1
          })
          jest
            .spyOn(strapi.query('plugin::stripe-payment.subscription'), 'findOne')
            .mockResolvedValue(defaultSubscription)
        },
        queryMethod: 'findOne',
        queryArgs: { where: { organization: { id: 1 } }, populate: ['organization', 'plan', 'plan.product'] }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks, queryMethod, queryArgs }) => {
      setupMocks()

      const result = await subscriptionService({ strapi }).getMySubscription(serviceMethodArgs)

      if (queryMethod && queryArgs) {
        expect(strapi.query('plugin::stripe-payment.subscription')[queryMethod]).toBeCalledWith(queryArgs)
      }

      expect(result).toEqual(expectedResult)
    })
  })

  describe('Get Subscriptions', () => {
    it.each([
      {
        name: 'should get all subscriptions',
        expectedResult: [defaultSubscription],
        setupMocks: () => {
          jest
            .spyOn(strapi.query('plugin::stripe-payment.subscription'), 'findMany')
            .mockResolvedValue([defaultSubscription])
        },
        queryMethod: 'findMany',
        queryArgs: { populate: { organization: true, plan: true } }
      }
    ])('$name', async ({ expectedResult, setupMocks, queryMethod, queryArgs }) => {
      setupMocks()

      const result = await subscriptionService({ strapi }).getSubscriptions()

      if (queryMethod && queryArgs) {
        expect(strapi.query('plugin::stripe-payment.subscription')[queryMethod]).toBeCalledWith(queryArgs)
      }

      expect(result).toEqual(expectedResult)
    })
  })

  describe('Cancel Subscription', () => {
    it.each([
      {
        name: 'should cancel a subscription',
        serviceMethodArgs: { id: 1 },
        expectedResult: true,
        setupMocks: () => {
          jest
            .spyOn(strapi.query('plugin::stripe-payment.subscription'), 'findOne')
            .mockResolvedValue(defaultSubscription)
          jest
            .spyOn(strapi.plugin('stripe-payment').service('stripe').subscriptions, 'cancel')
            .mockResolvedValue(canceledSubscription)
        },
        stripeServiceMethod: 'cancel',
        stripeServiceArgs: ['sub_123']
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks, stripeServiceMethod, stripeServiceArgs }) => {
      setupMocks()

      const result = await subscriptionService({ strapi }).cancelSubscription(serviceMethodArgs)

      if (stripeServiceMethod && stripeServiceArgs) {
        expect(strapi.plugin('stripe-payment').service('stripe').subscriptions[stripeServiceMethod]).toBeCalledWith(
          ...stripeServiceArgs
        )
      }

      expect(result).toEqual(expectedResult)
    })

    it.each([
      {
        name: 'should return null if subscription to cancel is not found',
        serviceMethodArgs: { id: 1 },
        expectedResult: null,
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.subscription'), 'findOne').mockResolvedValue(null)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks }) => {
      setupMocks()

      const result = await subscriptionService({ strapi }).cancelSubscription(serviceMethodArgs)

      expect(result).toEqual(expectedResult)
    })
  })

  describe('Pause Subscription', () => {
    it.each([
      {
        name: 'should pause a subscription',
        serviceMethodArgs: { id: 1 },
        expectedResult: updatedSubscription,
        setupMocks: () => {
          jest
            .spyOn(strapi.query('plugin::stripe-payment.subscription'), 'findOne')
            .mockResolvedValue(defaultSubscription)
          jest
            .spyOn(strapi.query('plugin::stripe-payment.subscription'), 'update')
            .mockResolvedValue(updatedSubscription)
          jest
            .spyOn(strapi.plugin('stripe-payment').service('stripe').subscriptions, 'update')
            .mockResolvedValue(updatedSubscription)
        },
        stripeServiceMethod: 'update',
        stripeServiceArgs: ['sub_123', { pause_collection: { behavior: 'void' } }],
        queryMethod: 'update',
        queryArgs: { where: { id: 1 }, data: { status: SubscriptionStatus.PAUSED } }
      }
    ])(
      '$name',
      async ({
        serviceMethodArgs,
        expectedResult,
        setupMocks,
        stripeServiceMethod,
        stripeServiceArgs,
        queryMethod,
        queryArgs
      }) => {
        setupMocks()

        const result = await subscriptionService({ strapi }).pauseSubscription(serviceMethodArgs)

        if (stripeServiceMethod && stripeServiceArgs) {
          expect(strapi.plugin('stripe-payment').service('stripe').subscriptions[stripeServiceMethod]).toBeCalledWith(
            ...stripeServiceArgs
          )
        }

        if (queryMethod && queryArgs) {
          expect(strapi.query('plugin::stripe-payment.subscription')[queryMethod]).toBeCalledWith(queryArgs)
        }

        expect(result).toEqual(expectedResult)
      }
    )

    it.each([
      {
        name: 'should return null if subscription to pause is not found',
        serviceMethodArgs: { id: 1 },
        expectedResult: null,
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.subscription'), 'findOne').mockResolvedValue(null)
        },
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks }) => {
      setupMocks()

      const result = await subscriptionService({ strapi }).pauseSubscription(serviceMethodArgs)

      expect(result).toEqual(expectedResult)
    })
  })

  describe('Resume Subscription', () => {
    it.each([
      {
        name: 'should resume a subscription',
        serviceMethodArgs: { id: 1 },
        expectedResult: defaultSubscription,
        setupMocks: () => {
          jest
            .spyOn(strapi.query('plugin::stripe-payment.subscription'), 'findOne')
            .mockResolvedValue(updatedSubscription)
          jest
            .spyOn(strapi.query('plugin::stripe-payment.subscription'), 'update')
            .mockResolvedValue(defaultSubscription)
          jest
            .spyOn(strapi.plugin('stripe-payment').service('stripe').subscriptions, 'update')
            .mockResolvedValue(defaultSubscription)
        },
        stripeServiceMethod: 'update',
        stripeServiceArgs: ['sub_123', { pause_collection: null }],
        queryMethod: 'update',
        queryArgs: { where: { id: 1 }, data: { status: SubscriptionStatus.ACTIVE } }
      }
    ])(
      '$name',
      async ({
        serviceMethodArgs,
        expectedResult,
        setupMocks,
        stripeServiceMethod,
        stripeServiceArgs,
        queryMethod,
        queryArgs
      }) => {
        setupMocks()

        const result = await subscriptionService({ strapi }).resumeSubscription(serviceMethodArgs)

        if (stripeServiceMethod && stripeServiceArgs) {
          expect(strapi.plugin('stripe-payment').service('stripe').subscriptions[stripeServiceMethod]).toBeCalledWith(
            ...stripeServiceArgs
          )
        }

        if (queryMethod && queryArgs) {
          expect(strapi.query('plugin::stripe-payment.subscription')[queryMethod]).toBeCalledWith(queryArgs)
        }

        expect(result).toEqual(expectedResult)
      }
    )

    it.each([
      {
        name: 'should return null if subscription to resume is not found',
        serviceMethodArgs: { id: 1 },
        expectedResult: null,
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.subscription'), 'findOne').mockResolvedValue(null)
        },
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks }) => {
      setupMocks()

      const result = await subscriptionService({ strapi }).resumeSubscription(serviceMethodArgs)

      expect(result).toEqual(expectedResult)
    })
  })

  describe('Update Stripe Subscription', () => {
    it.each([
      {
        name: 'should update a stripe subscription',
        serviceMethodArgs: { id: 1, quantity: 2 },
        expectedResult: { id: 1, stripe_id: 'sub_123', plan: { id: 1, stripe_id: 'price_123' } },
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.subscription'), 'findOne').mockResolvedValue({
            id: 1,
            stripe_id: 'sub_123',
            organization: { id: 1, users: [{ id: 1 }] },
            plan: { id: 1, stripe_id: 'price_123' }
          })
          jest.spyOn(strapi.query('plugin::stripe-payment.subscription'), 'update').mockResolvedValue({
            id: 1,
            stripe_id: 'sub_123',
            plan: { id: 1, stripe_id: 'price_123' }
          })
          jest.spyOn(strapi.plugin('stripe-payment').service('stripe').subscriptions, 'update').mockResolvedValue({
            id: 'sub_123',
            status: 'active'
          })
        },
        stripeServiceMethod: 'update',
        stripeServiceArgs: ['sub_123', { items: [{ id: 'item_123', price: 'price_123', quantity: 2 }] }],
        queryMethod: 'update',
        queryArgs: { where: { id: 1 }, data: { plan: { id: 1, stripe_id: 'price_123' } } }
      }
    ])(
      '$name',
      async ({
        serviceMethodArgs,
        expectedResult,
        setupMocks,
        stripeServiceMethod,
        stripeServiceArgs,
        queryMethod,
        queryArgs
      }) => {
        setupMocks()

        const result = await subscriptionService({ strapi }).updateStripeSubscription(serviceMethodArgs)

        if (stripeServiceMethod && stripeServiceArgs) {
          expect(strapi.plugin('stripe-payment').service('stripe').subscriptions[stripeServiceMethod]).toBeCalledWith(
            ...stripeServiceArgs
          )
        }

        if (queryMethod && queryArgs) {
          expect(strapi.query('plugin::stripe-payment.subscription')[queryMethod]).toBeCalledWith(queryArgs)
        }

        expect(result).toEqual(expectedResult)
      }
    )
  })

  describe('Resubscribe', () => {
    it.each([
      {
        name: 'should resubscribe',
        serviceMethodArgs: { id: 1 },
        expectedResult: true,
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.subscription'), 'findOne').mockResolvedValue({
            id: 1,
            status: SubscriptionStatus.CANCELLED,
            organization: { id: 1, customer_id: 'cus_123', users: [{ id: 1 }] },
            plan: { id: 1, stripe_id: 'price_123' }
          })
          jest.spyOn(strapi.query('plugin::stripe-payment.subscription'), 'update').mockResolvedValue({
            id: 1,
            stripe_id: 'sub_123',
            status: SubscriptionStatus.ACTIVE
          })
          jest.spyOn(strapi.plugin('stripe-payment').service('stripe').subscriptions, 'create').mockResolvedValue({
            id: 'sub_123'
          })
        },
        stripeServiceMethod: 'create',
        stripeServiceArgs: [
          {
            customer: 'cus_123',
            items: [{ price: 'price_123', quantity: 1 }]
          }
        ],
        queryMethod: 'update',
        queryArgs: { where: { id: 1 }, data: { stripe_id: 'sub_123', status: SubscriptionStatus.ACTIVE } }
      }
    ])(
      '$name',
      async ({
        serviceMethodArgs,
        expectedResult,
        setupMocks,
        stripeServiceMethod,
        stripeServiceArgs,
        queryMethod,
        queryArgs
      }) => {
        setupMocks()

        const result = await subscriptionService({ strapi }).resubscribe(serviceMethodArgs)

        if (stripeServiceMethod && stripeServiceArgs) {
          expect(strapi.plugin('stripe-payment').service('stripe').subscriptions[stripeServiceMethod]).toBeCalledWith(
            ...stripeServiceArgs
          )
        }

        if (queryMethod && queryArgs) {
          expect(strapi.query('plugin::stripe-payment.subscription')[queryMethod]).toBeCalledWith(queryArgs)
        }

        expect(result).toEqual(expectedResult)
      }
    )
  })
})
