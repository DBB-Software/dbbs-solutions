import createHttpError from 'http-errors'
import { Context } from 'koa'
import { Strapi } from '@strapi/strapi'
import planController from '../../server/controllers/plan'
import { createMockContext, createMockStrapi } from '../factories'
import { defaultPlan, strapiPlanControllerMock } from '../mocks'
import { BillingPeriod, PlanType } from '../../server/enums'

describe('Plan Controller', () => {
  let strapi: Strapi

  beforeEach(() => {
    strapi = createMockStrapi(strapiPlanControllerMock)
  })

  describe('Create', () => {
    it.each([
      {
        name: 'should create a plan',
        ctxOverrides: {
          request: { body: { price: 1000, interval: BillingPeriod.MONTH, productId: 1, type: PlanType.RECURRING } }
        },
        serviceMethodArgs: { price: 1000, interval: BillingPeriod.MONTH, productId: 1, type: PlanType.RECURRING },
        expectedResult: defaultPlan
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      await planController({ strapi }).create(ctx)
      expect(strapi.plugin('stripe-payment').service('plan').create).toBeCalledWith(serviceMethodArgs)
      expect(ctx.send).toBeCalledWith(expectedResult)
    })
  })

  describe('Get Plan By Id', () => {
    it.each([
      {
        name: 'should get a plan by id',
        ctxOverrides: { params: { id: 1 } },
        serviceMethodArgs: { id: 1 },
        expectedResult: defaultPlan
      },
      {
        name: 'should throw an error if plan not found',
        ctxOverrides: { params: { id: 1 } },
        serviceMethodArgs: { id: 1 },
        error: createHttpError.NotFound
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult, error }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      if (error) {
        strapi.plugin('stripe-payment').service('plan').getPlanById.mockResolvedValue(null)
        await expect(planController({ strapi }).getPlanById(ctx)).rejects.toThrow(error)
      } else {
        await planController({ strapi }).getPlanById(ctx)
        expect(strapi.plugin('stripe-payment').service('plan').getPlanById).toBeCalledWith(serviceMethodArgs)
        expect(ctx.send).toBeCalledWith(expectedResult)
      }
    })
  })

  describe('Get Plans', () => {
    it.each([
      {
        name: 'should get all plans',
        ctxOverrides: {},
        serviceMethodArgs: [],
        expectedResult: [defaultPlan]
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      await planController({ strapi }).getPlans(ctx)
      expect(strapi.plugin('stripe-payment').service('plan').getPlans).toBeCalledWith(...serviceMethodArgs)
      expect(ctx.send).toBeCalledWith(expectedResult)
    })
  })
})
