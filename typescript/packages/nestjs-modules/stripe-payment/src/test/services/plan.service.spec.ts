import { jest } from '@jest/globals'
import { Test, TestingModule } from '@nestjs/testing'
import { PlanService as StripePriceService } from '@dbbs/nestjs-module-stripe'
import { ArgumentError, NotFoundError } from '@dbbs/common'

import { PlanService } from '../../services/index.js'
import { PlanRepository, ProductRepository } from '../../repositories/index.js'
import { BillingPeriod, Currency, PlanType } from '../../enums/index.js'
import { defaultRecurringPlan, defaultProduct, stripePrice, defaultOneTimePlan } from '../mocks/index.js'

describe('PlanService', () => {
  let service: PlanService
  let stripePriceService: jest.Mocked<StripePriceService>
  let planRepository: jest.Mocked<PlanRepository>
  let productRepository: jest.Mocked<ProductRepository>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanService,
        {
          provide: StripePriceService,
          useValue: {
            create: jest.fn(),
            delete: jest.fn()
          }
        },
        {
          provide: PlanRepository,
          useValue: {
            getPlanById: jest.fn(),
            createPlan: jest.fn(),
            deletePlan: jest.fn()
          }
        },
        {
          provide: ProductRepository,
          useValue: {
            getProductById: jest.fn()
          }
        }
      ]
    }).compile()

    service = module.get<PlanService>(PlanService)
    stripePriceService = module.get(StripePriceService) as jest.Mocked<StripePriceService>
    planRepository = module.get(PlanRepository) as jest.Mocked<PlanRepository>
    productRepository = module.get(ProductRepository) as jest.Mocked<ProductRepository>
  })

  describe('getPlanById', () => {
    it.each([
      {
        name: 'should return the plan by ID',
        serviceMethodArgs: 1,
        expectedResult: defaultRecurringPlan,
        setupMocks: () => {
          planRepository.getPlanById.mockResolvedValue(defaultRecurringPlan)
        }
      },
      {
        name: 'should return null if the plan was not found',
        serviceMethodArgs: 999,
        expectedResult: null,
        setupMocks: () => {
          planRepository.getPlanById.mockResolvedValue(null)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks }) => {
      setupMocks()

      const result = await service.getPlanById(serviceMethodArgs)

      expect(result).toEqual(expectedResult)
      expect(planRepository.getPlanById).toHaveBeenCalledWith(serviceMethodArgs)
    })
  })

  describe('createPlan', () => {
    it.each([
      {
        name: 'should create a plan',
        serviceMethodArgs: {
          price: defaultRecurringPlan.price,
          interval: defaultRecurringPlan.interval as BillingPeriod,
          productId: defaultRecurringPlan.productId,
          type: defaultRecurringPlan.type,
          currency: Currency.USD
        },
        expectedResult: defaultRecurringPlan,
        expectedParams: {
          productRepositorySelect: 1,
          stripePriceServiceCreate: {
            price: defaultRecurringPlan.price,
            interval: defaultRecurringPlan.interval as BillingPeriod,
            type: defaultRecurringPlan.type,
            productId: 'prod_1',
            currency: Currency.USD
          },
          planRepositoryCreate: {
            price: defaultRecurringPlan.price,
            interval: defaultRecurringPlan.interval as BillingPeriod,
            stripeId: defaultRecurringPlan.stripeId,
            productId: defaultRecurringPlan.productId,
            type: defaultRecurringPlan.type
          }
        },
        setupMocks: () => {
          productRepository.getProductById.mockResolvedValue(defaultProduct)
          stripePriceService.create.mockResolvedValue(stripePrice)
          planRepository.createPlan.mockResolvedValue(defaultRecurringPlan)
        }
      },
      {
        name: 'should create a plan without an interval',
        serviceMethodArgs: {
          price: defaultOneTimePlan.price,
          productId: defaultOneTimePlan.productId,
          type: defaultOneTimePlan.type,
          currency: Currency.USD
        },
        expectedResult: defaultOneTimePlan,
        expectedParams: {
          productRepositorySelect: 1,
          stripePriceServiceCreate: {
            price: defaultOneTimePlan.price,
            type: defaultOneTimePlan.type,
            productId: 'prod_1',
            currency: Currency.USD
          },
          planRepositoryCreate: {
            price: defaultOneTimePlan.price,
            stripeId: defaultOneTimePlan.stripeId,
            productId: defaultOneTimePlan.productId,
            type: defaultOneTimePlan.type
          }
        },
        setupMocks: () => {
          productRepository.getProductById.mockResolvedValue(defaultProduct)
          stripePriceService.create.mockResolvedValue(stripePrice)
          planRepository.createPlan.mockResolvedValue(defaultOneTimePlan)
        }
      },
      {
        name: 'should throw an error if product was not found',
        serviceMethodArgs: {
          price: 1000,
          interval: BillingPeriod.MONTH,
          productId: 999,
          type: PlanType.RECURRING,
          currency: Currency.USD
        },
        expectedError: new NotFoundError('Cannot create plan for non-existing product with ID 999'),
        expectedParams: {
          productRepositorySelect: 999
        },
        setupMocks: () => {
          productRepository.getProductById.mockResolvedValue(null)
        }
      },
      {
        name: 'should throw an error if interval is not provided for recurring plan',
        serviceMethodArgs: {
          price: 1000,
          productId: 999,
          type: PlanType.RECURRING,
          currency: Currency.USD
        },
        expectedError: new ArgumentError('Cannot create recurring plan without an interval')
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      if (setupMocks) {
        setupMocks()
      }

      try {
        const result = await service.createPlan(serviceMethodArgs)

        expect(result).toEqual(expectedResult)
        expect(stripePriceService.create).toHaveBeenCalledWith(expectedParams!.stripePriceServiceCreate)
        expect(planRepository.createPlan).toHaveBeenCalledWith(expectedParams!.planRepositoryCreate)
      } catch (error) {
        expect(error).toEqual(expectedError)
      }

      if (expectedParams) {
        expect(productRepository.getProductById).toHaveBeenCalledWith(expectedParams.productRepositorySelect)
      }
    })
  })

  describe('deletePlan', () => {
    it.each([
      {
        name: 'should delete a plan and a corresponding Stripe price',
        serviceMethodArgs: { id: 1 },
        expectedResult: true,
        expectedParams: {
          planRepositoryGetById: 1,
          stripePriceServiceDelete: { id: 'plan_1' },
          planRepositoryDelete: 1
        },
        setupMocks: () => {
          planRepository.getPlanById.mockResolvedValue(defaultRecurringPlan)
        }
      },
      {
        name: 'should return true if the plan is not found',
        serviceMethodArgs: { id: 999 },
        expectedResult: true,
        expectedParams: {
          planRepositoryGetById: 999
        },
        setupMocks: () => {
          planRepository.getPlanById.mockResolvedValue(null)
        }
      },
      {
        name: 'should handle NotFoundError from Stripe and return true',
        serviceMethodArgs: { id: 1 },
        expectedResult: true,
        expectedParams: {
          planRepositoryGetById: 1,
          stripePriceServiceDelete: { id: 'plan_1' }
        },
        setupMocks: () => {
          planRepository.getPlanById.mockResolvedValue(defaultRecurringPlan)
          stripePriceService.delete.mockRejectedValue(new NotFoundError('Stripe price does not exist'))
        }
      },
      {
        name: 'should throw an error if an unexpected error occurs',
        serviceMethodArgs: { id: 1 },
        expectedError: new Error('Error deleting plan'),
        expectedParams: {
          planRepositoryGetById: 1,
          stripePriceServiceDelete: { id: 'plan_1' },
          planRepositoryDelete: 1
        },
        setupMocks: () => {
          planRepository.getPlanById.mockResolvedValue(defaultRecurringPlan)
          planRepository.deletePlan.mockRejectedValue(new Error('Error deleting plan'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      try {
        const result = await service.deletePlan(serviceMethodArgs)
        expect(result).toEqual(expectedResult)
      } catch (error) {
        expect(error).toEqual(expectedError)
      }

      expect(planRepository.getPlanById).toHaveBeenCalledWith(expectedParams.planRepositoryGetById)

      if (expectedParams.stripePriceServiceDelete) {
        expect(stripePriceService.delete).toHaveBeenCalledWith(expectedParams.stripePriceServiceDelete)
      }
      if (expectedParams.planRepositoryDelete) {
        expect(planRepository.deletePlan).toHaveBeenCalledWith(expectedParams.planRepositoryDelete)
      }
    })
  })
})
