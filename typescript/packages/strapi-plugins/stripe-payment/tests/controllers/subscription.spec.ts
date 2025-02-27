import createHttpError from 'http-errors'
import { Context } from 'koa'
import { Strapi } from '@strapi/strapi'
import subscriptionController from '../../server/controllers/subscription'
import { strapiSubscriptionControllerMock } from '../mocks/default.mock'
import { createMockContext, createMockStrapi } from '../factories'
import { defaultSubscription, updatedSubscription } from '../mocks'

describe('Subscription Controller', () => {
  let strapi: Strapi

  beforeEach(() => {
    strapi = createMockStrapi(strapiSubscriptionControllerMock)
  })

  describe('Create Checkout Session', () => {
    it.each([
      {
        name: 'should create a checkout session',
        ctxOverrides: {
          request: { body: { organizationName: 'Test Organization', planId: 1, quantity: 1 } },
          state: { user: { id: 1 } }
        },
        serviceMethodArgs: { organizationName: 'Test Organization', planId: 1, quantity: 1, userId: 1 },
        expectedResult: { url: 'https://checkout.session.url' }
      },
      {
        name: 'should create a checkout session with organizationId',
        ctxOverrides: {
          request: { body: { planId: 1, quantity: 1, organizationId: 1 } },
          state: { user: { id: 1 } }
        },
        serviceMethodArgs: {
          planId: 1,
          quantity: 1,
          userId: 1,
          organizationId: 1
        },
        expectedResult: { url: 'https://checkout.session.url' }
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      await subscriptionController({ strapi }).createCheckoutSession(ctx)
      expect(strapi.plugin('stripe-payment').service('subscription').createCheckoutSession).toBeCalledWith(
        serviceMethodArgs
      )
      expect(ctx.send).toBeCalledWith(expectedResult)
    })
  })

  describe('Get Subscription By Id', () => {
    it.each([
      {
        name: 'should get a subscription by id',
        ctxOverrides: { params: { id: 1 }, state: { user: { id: 1 } } },
        serviceMethodArgs: { id: 1 },
        expectedResult: defaultSubscription
      },
      {
        name: 'should throw an error if subscription not found',
        ctxOverrides: { params: { id: 1 }, state: { user: { id: 1 } } },
        serviceMethodArgs: { id: 1 },
        error: createHttpError.NotFound
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult, error }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      if (error) {
        strapi.plugin('stripe-payment').service('subscription').getSubscriptionById.mockResolvedValue(null)
        await expect(subscriptionController({ strapi }).getSubscriptionById(ctx)).rejects.toThrow(error)
      } else {
        await subscriptionController({ strapi }).getSubscriptionById(ctx)
        expect(strapi.plugin('stripe-payment').service('subscription').getSubscriptionById).toBeCalledWith(
          serviceMethodArgs
        )
        expect(ctx.send).toBeCalledWith(expectedResult)
      }
    })
  })

  describe('Get My Subscription', () => {
    it.each([
      {
        name: 'should get my subscription',
        ctxOverrides: { state: { user: { id: 1 } } },
        serviceMethodArgs: { userId: 1 },
        expectedResult: [defaultSubscription]
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      await subscriptionController({ strapi }).getMySubscription(ctx)
      expect(strapi.plugin('stripe-payment').service('subscription').getMySubscription).toBeCalledWith(
        serviceMethodArgs
      )
      expect(ctx.send).toBeCalledWith(expectedResult)
    })
  })

  describe('Get Subscriptions', () => {
    it.each([
      {
        name: 'should get all subscriptions',
        ctxOverrides: { state: { user: { id: 1 } } },
        serviceMethodArgs: [],
        expectedResult: [defaultSubscription]
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      await subscriptionController({ strapi }).getSubscriptions(ctx)
      expect(strapi.plugin('stripe-payment').service('subscription').getSubscriptions).toBeCalledWith(
        ...serviceMethodArgs
      )
      expect(ctx.send).toBeCalledWith(expectedResult)
    })
  })

  describe('Cancel Subscription', () => {
    it.each([
      {
        name: 'should cancel a subscription',
        ctxOverrides: { params: { id: 1 }, state: { user: { id: 1 } } },
        serviceMethodArgs: { id: 1 },
        expectedResult: true
      },
      {
        name: 'should throw an error if subscription to cancel is not found',
        ctxOverrides: { params: { id: 1 }, state: { user: { id: 1 } } },
        serviceMethodArgs: { id: 1 },
        error: createHttpError.NotFound
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult, error }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      if (error) {
        strapi.plugin('stripe-payment').service('subscription').cancelSubscription.mockResolvedValue(null)
        await expect(subscriptionController({ strapi }).cancelSubscription(ctx)).rejects.toThrow(error)
      } else {
        await subscriptionController({ strapi }).cancelSubscription(ctx)
        expect(strapi.plugin('stripe-payment').service('subscription').cancelSubscription).toBeCalledWith(
          serviceMethodArgs
        )
        expect(ctx.send).toBeCalledWith(expectedResult)
      }
    })
  })

  describe('Pause Subscription', () => {
    it.each([
      {
        name: 'should pause a subscription',
        ctxOverrides: { params: { id: 1 }, state: { user: { id: 1 } } },
        serviceMethodArgs: { id: 1 },
        expectedResult: updatedSubscription
      },
      {
        name: 'should throw an error if subscription to pause is not found',
        ctxOverrides: { params: { id: 1 }, state: { user: { id: 1 } } },
        serviceMethodArgs: { id: 1 },
        error: createHttpError.NotFound
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult, error }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      if (error) {
        strapi.plugin('stripe-payment').service('subscription').pauseSubscription.mockResolvedValue(null)
        await expect(subscriptionController({ strapi }).pauseSubscription(ctx)).rejects.toThrow(error)
      } else {
        await subscriptionController({ strapi }).pauseSubscription(ctx)
        expect(strapi.plugin('stripe-payment').service('subscription').pauseSubscription).toBeCalledWith(
          serviceMethodArgs
        )
        expect(ctx.send).toBeCalledWith(expectedResult)
      }
    })
  })

  describe('Resume Subscription', () => {
    it.each([
      {
        name: 'should resume a subscription',
        ctxOverrides: { params: { id: 1 }, state: { user: { id: 1 } } },
        serviceMethodArgs: { id: 1 },
        expectedResult: defaultSubscription
      },
      {
        name: 'should throw an error if subscription to resume is not found',
        ctxOverrides: { params: { id: 1 }, state: { user: { id: 1 } } },
        serviceMethodArgs: { id: 1 },
        error: createHttpError.NotFound
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult, error }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      if (error) {
        strapi.plugin('stripe-payment').service('subscription').resumeSubscription.mockResolvedValue(null)
        await expect(subscriptionController({ strapi }).resumeSubscription(ctx)).rejects.toThrow(error)
      } else {
        await subscriptionController({ strapi }).resumeSubscription(ctx)
        expect(strapi.plugin('stripe-payment').service('subscription').resumeSubscription).toBeCalledWith(
          serviceMethodArgs
        )
        expect(ctx.send).toBeCalledWith(expectedResult)
      }
    })
  })

  describe('Update Stripe Subscription', () => {
    it.each([
      {
        name: 'should update a stripe subscription',
        ctxOverrides: { params: { id: 1 }, request: { body: { quantity: 1, planId: 1 } }, state: { user: { id: 1 } } },
        serviceMethodArgs: { id: 1, quantity: 1, planId: 1 },
        expectedResult: { id: 1, quantity: 1, planId: 1 }
      },
      {
        name: 'should throw an error if stripe subscription update fails',
        ctxOverrides: { params: { id: 1 }, request: { body: { quantity: 1, planId: 1 } }, state: { user: { id: 1 } } },
        serviceMethodArgs: { id: 1, quantity: 1, planId: 1 },
        error: createHttpError.NotFound
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult, error }) => {
      const ctx = createMockContext(ctxOverrides as unknown as Partial<Context>)
      if (error) {
        strapi.plugin('stripe-payment').service('subscription').updateStripeSubscription.mockResolvedValue(null)
        await expect(subscriptionController({ strapi }).updateStripeSubscription(ctx)).rejects.toThrow(error)
      } else {
        await subscriptionController({ strapi }).updateStripeSubscription(ctx)
        expect(strapi.plugin('stripe-payment').service('subscription').updateStripeSubscription).toBeCalledWith(
          serviceMethodArgs
        )
        expect(ctx.send).toBeCalledWith(expectedResult)
      }
    })
  })

  describe('Resubscribe', () => {
    it.each([
      {
        name: 'should resubscribe',
        ctxOverrides: { params: { id: 1 }, state: { user: { id: 1 } } },
        serviceMethodArgs: { id: 1 },
        expectedResult: true
      },
      {
        name: 'should throw an error if resubscribe fails',
        ctxOverrides: { params: { id: 1 }, state: { user: { id: 1 } } },
        serviceMethodArgs: { id: 1 },
        error: createHttpError.NotFound
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult, error }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      if (error) {
        strapi.plugin('stripe-payment').service('subscription').resubscribe.mockResolvedValue(null)
        await expect(subscriptionController({ strapi }).resubscribe(ctx)).rejects.toThrow(error)
      } else {
        await subscriptionController({ strapi }).resubscribe(ctx)
        expect(strapi.plugin('stripe-payment').service('subscription').resubscribe).toBeCalledWith(serviceMethodArgs)
        expect(ctx.send).toBeCalledWith(expectedResult)
      }
    })
  })
})
