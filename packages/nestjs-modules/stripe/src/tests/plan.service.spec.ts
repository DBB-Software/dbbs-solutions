import { Test, TestingModule } from '@nestjs/testing'
import { PlanService } from '../services/plan.service.js'
import { STRIPE_SDK } from '../constants.js'
import Stripe from 'stripe'
import * as createHttpError from 'http-errors'
import {
  defaultPlan,
  deletedPlan,
  getMockedMethod,
  planListMock,
  ResourceName,
  ResourceMethods
} from '../mocks/index.js'
import { BillingPeriod, PlanType } from '../enums/planType.js'

describe('PlanService', () => {
  let service: PlanService
  let stripeMock: jest.Mocked<Stripe>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanService,
        {
          provide: STRIPE_SDK,
          useValue: {
            prices: {
              create: jest.fn(),
              retrieve: jest.fn(),
              list: jest.fn(),
              update: jest.fn()
            }
          }
        }
      ]
    }).compile()

    service = module.get<PlanService>(PlanService)
    stripeMock = module.get<Stripe>(STRIPE_SDK) as jest.Mocked<Stripe>
  })

  describe('Create', () => {
    it.each([
      {
        name: 'should create a plan',
        serviceMethodArgs: {
          price: 10,
          interval: BillingPeriod.MONTH,
          productId: 'prod_1',
          type: PlanType.ONE_TIME,
          currency: 'usd'
        },
        expectedResult: defaultPlan,
        stripeServiceMethodName: 'create',
        stripeServiceMethodArgs: [
          {
            currency: 'usd',
            product: 'prod_1',
            unit_amount: 1000
          }
        ],
        setupMocks: () => {
          jest.spyOn(stripeMock.prices, 'create').mockResolvedValue(defaultPlan)
        }
      },
      {
        name: 'should create a recurring plan',
        serviceMethodArgs: {
          price: 10,
          interval: BillingPeriod.MONTH,
          productId: 'prod_1',
          type: PlanType.RECURRING,
          currency: 'usd'
        },
        expectedResult: defaultPlan,
        stripeServiceMethodName: 'create',
        stripeServiceMethodArgs: [
          {
            currency: 'usd',
            product: 'prod_1',
            unit_amount: 1000,
            recurring: { interval: BillingPeriod.MONTH }
          }
        ],
        setupMocks: () => {
          jest.spyOn(stripeMock.prices, 'create').mockResolvedValue(defaultPlan)
        }
      }
    ])(
      '$name',
      async ({ serviceMethodArgs, expectedResult, stripeServiceMethodName, stripeServiceMethodArgs, setupMocks }) => {
        setupMocks()

        const result = await service.create(serviceMethodArgs)

        expect(result).toEqual(expectedResult)

        const createPlanMock = getMockedMethod(stripeMock, 'prices', stripeServiceMethodName as keyof Stripe['prices'])
        expect(createPlanMock).toHaveBeenCalledWith(...stripeServiceMethodArgs)
      }
    )
  })

  describe('Get plan by id', () => {
    it.each([
      {
        name: 'should get a plan by id',
        serviceMethodArgs: { id: 'plan_1' },
        expectedResult: defaultPlan,
        expectedParams: {
          planRetrieve: 'plan_1'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.prices, 'retrieve').mockResolvedValue(defaultPlan)
        }
      },
      {
        name: 'should throw an error if plan by id is not found',
        serviceMethodArgs: { id: 'plan_999' },
        expectedResult: new createHttpError.NotFound('Plan with ID plan_999 not found'),
        expectedParams: {
          planRetrieve: 'plan_999'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.prices, 'retrieve').mockRejectedValue(new Error('Not Found'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      const retrievePlanMock = getMockedMethod(stripeMock, 'prices', 'retrieve')
      try {
        const result = await service.getPlanById(serviceMethodArgs)
        expect(result).toEqual(expectedResult)
      } catch (error) {
        expect(error).toEqual(expectedResult)
      }

      expect(retrievePlanMock).toHaveBeenCalledWith(expectedParams.planRetrieve)
    })
  })

  describe('Get Plans', () => {
    it.each([
      {
        name: 'should get all plans',
        expectedResult: planListMock.data,
        setupMocks: () => {
          jest.spyOn(stripeMock.prices, 'list').mockResolvedValue(planListMock)
        }
      },
      {
        name: 'should throw an error if there is an issue fetching plans',
        expectedResult: new createHttpError.NotFound('Error fetching plans'),
        setupMocks: () => {
          jest.spyOn(stripeMock.prices, 'list').mockRejectedValue(new Error('Fetch error'))
        }
      }
    ])('$name', async ({ expectedResult, setupMocks }) => {
      setupMocks()

      try {
        const result = await service.getPlans()
        expect(result).toEqual(expectedResult)
      } catch (error) {
        expect(error).toEqual(expectedResult)
      }
    })
  })

  describe('Delete', () => {
    it.each([
      {
        name: 'should delete a plan',
        serviceMethodArgs: { id: 'plan_1' },
        expectedResult: deletedPlan,
        expectedParams: {
          planRetrieve: 'plan_1',
          planUpdate: ['plan_1', { active: false }]
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.prices, 'retrieve').mockResolvedValue(defaultPlan)
          jest.spyOn(stripeMock.prices, 'update').mockResolvedValue(deletedPlan)
        }
      },
      {
        name: 'should throw an error if plan to delete is not found',
        serviceMethodArgs: { id: 'plan_999' },
        expectedResult: new createHttpError.NotFound('Plan with ID plan_999 not found'),
        expectedParams: {
          planRetrieve: 'plan_999'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.prices, 'retrieve').mockRejectedValue(new Error('Not Found'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      const retrievePlanMock = getMockedMethod(stripeMock, 'prices', 'retrieve')
      try {
        const result = await service.delete(serviceMethodArgs)
        expect(result).toEqual(expectedResult)

        const updatePlanMock = getMockedMethod(stripeMock, 'prices', 'update')
        expect(updatePlanMock).toHaveBeenCalledWith(...expectedParams.planUpdate!)
      } catch (error) {
        expect(error).toEqual(expectedResult)
      }

      expect(retrievePlanMock).toHaveBeenCalledWith(expectedParams.planRetrieve)
    })
  })
})
