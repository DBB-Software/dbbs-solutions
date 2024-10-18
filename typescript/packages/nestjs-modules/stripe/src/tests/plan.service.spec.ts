import { Test, TestingModule } from '@nestjs/testing'
import { PlanService } from '../services/plan.service.js'
import { STRIPE_SDK } from '../constants.js'
import Stripe from 'stripe'
import {
  defaultPlan,
  deletedPlan,
  getMockedMethod,
  planListMock
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
      },
      {
        name: 'should throw an error if interval is not provided for recurring plan',
        serviceMethodArgs: {
          price: 10,
          productId: 'prod_1',
          type: PlanType.RECURRING,
          currency: 'usd'
        },
        expectedError: new Error('Interval must be provided for recurring plan'),
      },
      {
        name: 'should throw an error if failed to create a plan',
        serviceMethodArgs: {
          price: 10,
          interval: BillingPeriod.MONTH,
          productId: 'prod_1',
          type: PlanType.ONE_TIME,
          currency: 'usd'
        },
        expectedError: new Error('Failed to create plan'),
        stripeServiceMethodName: 'create',
        stripeServiceMethodArgs: [
          {
            currency: 'usd',
            product: 'prod_1',
            unit_amount: 1000
          }
        ],
        setupMocks: () => {
          jest.spyOn(stripeMock.prices, 'create').mockRejectedValue(new Error('Failed to create plan'))
        }
      }
    ])(
      '$name',
      async ({ serviceMethodArgs, expectedResult, expectedError, stripeServiceMethodName, stripeServiceMethodArgs, setupMocks }) => {
        if (setupMocks) {
          setupMocks()
        }

        const pendingResult = service.create(serviceMethodArgs)
        if (expectedResult) {
          await expect(pendingResult).resolves.toEqual(expectedResult)

          const createPlanMock = getMockedMethod(stripeMock, 'prices', stripeServiceMethodName as keyof Stripe['prices'])
          expect(createPlanMock).toHaveBeenCalledWith(...stripeServiceMethodArgs!)
        } else {
          await expect(pendingResult).rejects.toMatchObject(expectedError)
        }
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
        name: 'should throw an error if failed to get plan by id',
        serviceMethodArgs: { id: 'plan_1' },
        expectedError: new Error('Error getting plan'),
        expectedParams: {
          planRetrieve: 'plan_1'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.prices, 'retrieve').mockRejectedValue(new Error('Error getting plan'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const retrievePlanMock = getMockedMethod(stripeMock, 'prices', 'retrieve')

      const pendingResult = service.getPlanById(serviceMethodArgs)
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
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
        name: 'should throw an error if failed to get plans',
        expectedError: new Error('Error getting plans'),
        setupMocks: () => {
          jest.spyOn(stripeMock.prices, 'list').mockRejectedValue(new Error('Error getting plans'))
        }
      }
    ])('$name', async ({ expectedResult, expectedError, setupMocks }) => {
      setupMocks()

      const pendingResult = service.getPlans()
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
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
          planUpdate: ['plan_1', { active: false }]
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.prices, 'update').mockResolvedValue(deletedPlan)
        }
      },
      {
        name: 'should throw an error if there is an error deleting plan',
        serviceMethodArgs: { id: 'plan_1' },
        expectedError: new Error('Error deleting plan'),
        setupMocks: () => {
          jest.spyOn(stripeMock.prices, 'update').mockRejectedValue(new Error('Error deleting plan'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = service.delete(serviceMethodArgs)
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      }

      if (expectedParams?.planUpdate) {
        const updatePlanMock = getMockedMethod(stripeMock, 'prices', 'update')
        expect(updatePlanMock).toHaveBeenCalledWith(...expectedParams.planUpdate!)
      }
    })
  })
})
