import { Strapi } from '@strapi/strapi'
import planService from '../../server/services/plan'
import { createMockStrapi } from '../factories'
import { BillingPeriod, PlanType } from '../../server/enums'
import { defaultPlan, strapiPlanServiceMock } from '../mocks'

jest.mock('stripe')

describe('Plan Service', () => {
  let strapi: Strapi

  beforeEach(() => {
    strapi = createMockStrapi(strapiPlanServiceMock)
  })

  describe('Create', () => {
    it.each([
      {
        name: 'should create a plan',
        serviceMethodArgs: { price: 1000, interval: BillingPeriod.MONTH, productId: 1, type: PlanType.RECURRING },
        expectedResult: defaultPlan,
        setupMocks: () => {
          jest
            .spyOn(strapi.query('plugin::stripe-payment.product'), 'findOne')
            .mockResolvedValue({ id: 1, name: 'Test Product', stripe_id: 'prod_123', plans: [] })
          jest.spyOn(strapi.query('plugin::stripe-payment.plan'), 'create').mockResolvedValue(defaultPlan)
          jest.spyOn(strapi.plugin('stripe-payment').service('stripe').prices, 'create').mockResolvedValue(defaultPlan)
        },
        stripeServiceMethod: 'create',
        stripeServiceArgs: [
          {
            currency: 'usd',
            product: 'prod_123',
            recurring: { interval: 'month' },
            unit_amount: 100000
          }
        ],
        queryMethod: 'create',
        queryArgs: {
          data: {
            price: 1000,
            interval: 'month',
            stripe_id: 1,
            product: 1,
            type: PlanType.RECURRING
          }
        }
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

        const result = await planService({ strapi }).create(serviceMethodArgs)

        if (stripeServiceMethod && stripeServiceArgs) {
          expect(strapi.plugin('stripe-payment').service('stripe').prices[stripeServiceMethod]).toBeCalledWith(
            ...stripeServiceArgs
          )
        }

        if (queryMethod && queryArgs) {
          expect(strapi.query('plugin::stripe-payment.plan')[queryMethod]).toBeCalledWith(queryArgs)
        }

        expect(result).toEqual(expectedResult)
      }
    )
  })

  describe('Get Plan By Id', () => {
    it.each([
      {
        name: 'should get a plan by id',
        serviceMethodArgs: { id: 1 },
        expectedResult: defaultPlan,
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.plan'), 'findOne').mockResolvedValue(defaultPlan)
        },
        queryMethod: 'findOne',
        queryArgs: { where: { id: 1 } }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks, queryMethod, queryArgs }) => {
      setupMocks()

      const result = await planService({ strapi }).getPlanById(serviceMethodArgs)

      if (queryMethod && queryArgs) {
        expect(strapi.query('plugin::stripe-payment.plan')[queryMethod]).toBeCalledWith(queryArgs)
      }

      expect(result).toEqual(expectedResult)
    })

    it.each([
      {
        name: 'should return null if plan by id is not found',
        serviceMethodArgs: { id: 1 },
        expectedResult: null,
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.plan'), 'findOne').mockResolvedValue(null)
        },
        queryMethod: 'findOne',
        queryArgs: { where: { id: 1 } }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks, queryMethod, queryArgs }) => {
      setupMocks()

      const result = await planService({ strapi }).getPlanById(serviceMethodArgs)

      if (queryMethod && queryArgs) {
        expect(strapi.query('plugin::stripe-payment.plan')[queryMethod]).toBeCalledWith(queryArgs)
      }

      expect(result).toEqual(expectedResult)
    })
  })

  describe('Get Plans', () => {
    it.each([
      {
        name: 'should get all plans',
        expectedResult: [defaultPlan],
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.plan'), 'findMany').mockResolvedValue([defaultPlan])
        },
        queryMethod: 'findMany',
        queryArgs: {}
      }
    ])('$name', async ({ expectedResult, setupMocks, queryMethod, queryArgs }) => {
      setupMocks()

      const result = await planService({ strapi }).getPlans()

      if (queryMethod && queryArgs) {
        expect(strapi.query('plugin::stripe-payment.plan')[queryMethod]).toBeCalledWith(queryArgs)
      }

      expect(result).toEqual(expectedResult)
    })
  })
})
