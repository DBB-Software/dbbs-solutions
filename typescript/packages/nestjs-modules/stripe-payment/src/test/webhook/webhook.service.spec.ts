import { jest } from '@jest/globals'
import { Test, TestingModule } from '@nestjs/testing'
import { WebhookService } from '../../webhook/webhook.service.js'
import { ProductRepository } from '../../repositories/product.repository.js'
import {
  defaultProduct,
  defaultRecurringPlan,
  priceCreatedStripeEvent,
  priceDeletedStripeEvent,
  priceUpdatedStripeEvent,
  productCreatedStripeEvent,
  productDeletedStripeEvent,
  productUpdatedStripeEvent,
  stripeProduct
} from '../mocks/index.js'
import { BillingPeriod, PlanType } from '../../enums/index.js'
import { PlanRepository } from '../../repositories/plan.repository.js'
import { ProductService as StripeProductService } from '@dbbs/nestjs-module-stripe'

describe('WebhookService', () => {
  let service: WebhookService
  let productRepository: jest.Mocked<ProductRepository>
  let planRepository: jest.Mocked<PlanRepository>
  let stripeProductService: jest.Mocked<StripeProductService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        {
          provide: ProductRepository,
          useValue: {
            productExistsByStripeId: jest.fn(),
            getProductByStripeId: jest.fn(),
            createProduct: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn()
          }
        },
        {
          provide: PlanRepository,
          useValue: {
            planExistsByStripeId: jest.fn(),
            getPlanByStripeId: jest.fn(),
            createPlan: jest.fn(),
            deletePlan: jest.fn(),
            updatePlan: jest.fn()
          }
        },
        {
          provide: StripeProductService,
          useValue: {
            getProductById: jest.fn()
          }
        }
      ]
    }).compile()

    service = module.get<WebhookService>(WebhookService)
    productRepository = module.get(ProductRepository)
    planRepository = module.get(PlanRepository)
    stripeProductService = module.get(StripeProductService)
  })

  describe('handleProductCreated', () => {
    it.each([
      {
        name: 'should not create product and return null if product already exists',
        serviceMethodArgs: productCreatedStripeEvent,
        expectedParams: {
          createProduct: { name: 'Product 1', stripeId: 'prod_1' }
        },
        expectedResult: null,
        setupMocks: () => {
          productRepository.createProduct.mockRejectedValue({
            code: 'SQLITE_CONSTRAINT',
            message: 'UNIQUE CONSTRAINT FAILED'
          })
        }
      },
      {
        name: 'should create product if it does not exist',
        serviceMethodArgs: productCreatedStripeEvent,
        expectedParams: {
          createProduct: { name: 'Product 1', stripeId: 'prod_1' }
        },
        expectedResult: defaultProduct,
        setupMocks: () => {
          productRepository.createProduct.mockResolvedValue(defaultProduct)
        }
      },
      {
        name: 'should throw an error if any other error occurs',
        serviceMethodArgs: productCreatedStripeEvent,
        expectedParams: {
          createProduct: { name: 'Product 1', stripeId: 'prod_1' }
        },
        expectedError: { name: 'error', code: 'SOME_ANOTHER_ERROR', message: 'ERROR OCCURRED' },
        setupMocks: () => {
          productRepository.createProduct.mockRejectedValue({
            name: 'error',
            code: 'SOME_ANOTHER_ERROR',
            message: 'ERROR OCCURRED'
          })
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedParams, expectedResult, expectedError, setupMocks }) => {
      setupMocks()

      const pendingResult = service.handleProductCreated(serviceMethodArgs)
      if (expectedResult !== undefined) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      }

      expect(productRepository.createProduct).toHaveBeenCalledWith(expectedParams.createProduct)
    })
  })

  describe('handleProductUpdated', () => {
    it.each([
      {
        name: 'should not update product if it does not exist',
        serviceMethodArgs: productUpdatedStripeEvent,
        expectedParams: {
          getProductByStripeId: 'prod_1'
        },
        setupMocks: () => {
          productRepository.getProductByStripeId.mockResolvedValue(null)
        }
      },
      {
        name: 'should update product if the name has changed',
        serviceMethodArgs: productUpdatedStripeEvent,
        expectedParams: {
          getProductByStripeId: 'prod_1',
          updateProduct: { id: 1, name: 'Updated Product Name' }
        },
        setupMocks: () => {
          productRepository.getProductByStripeId.mockResolvedValue({
            ...defaultProduct,
            id: 1,
            name: 'Old Product Name'
          })
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedParams, setupMocks }) => {
      setupMocks()

      await service.handleProductUpdated(serviceMethodArgs)

      expect(productRepository.getProductByStripeId).toHaveBeenCalledWith(expectedParams.getProductByStripeId)

      if (expectedParams.updateProduct) {
        expect(productRepository.updateProduct).toHaveBeenCalledWith(expectedParams.updateProduct)
      }
    })
  })

  describe('handleProductDeleted', () => {
    it.each([
      {
        name: 'should not delete product if it is already deleted',
        serviceMethodArgs: productDeletedStripeEvent,
        expectedParams: {
          getProductByStripeId: 'prod_1'
        },
        setupMocks: () => {
          productRepository.getProductByStripeId.mockResolvedValue(null)
        }
      },
      {
        name: 'should delete product if it exists',
        serviceMethodArgs: productDeletedStripeEvent,
        expectedParams: {
          getProductByStripeId: 'prod_1',
          deleteProduct: 1
        },
        setupMocks: () => {
          productRepository.getProductByStripeId.mockResolvedValue(defaultProduct)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedParams, setupMocks }) => {
      setupMocks()

      await service.handleProductDeleted(serviceMethodArgs)

      expect(productRepository.getProductByStripeId).toHaveBeenCalledWith(expectedParams.getProductByStripeId)
      if (expectedParams.deleteProduct) {
        expect(productRepository.deleteProduct).toHaveBeenCalledWith(expectedParams.deleteProduct)
      }
    })
  })

  describe('handlePriceCreated', () => {
    it.each([
      {
        name: 'should not create plan if it already exists and a product exists',
        serviceMethodArgs: priceCreatedStripeEvent,
        expectedParams: {
          getProductByStripeId: 'prod_1',
          getStripeProductById: { id: 'prod_1' },
          createPlan: {
            price: 1000,
            interval: BillingPeriod.MONTH,
            stripeId: 'plan_1',
            productId: 1,
            type: PlanType.RECURRING
          }
        },
        expectedResult: null,
        setupMocks: () => {
          planRepository.createPlan.mockRejectedValue({
            name: 'error',
            code: 'SQLITE_CONSTRAINT',
            message: 'UNIQUE CONSTRAINT FAILED'
          })
          productRepository.getProductByStripeId.mockResolvedValue(defaultProduct)
        }
      },
      {
        name: 'should create plan and product if neither of them exist in database',
        serviceMethodArgs: priceCreatedStripeEvent,
        expectedParams: {
          getProductByStripeId: 'prod_1',
          getStripeProductById: { id: 'prod_1' },
          createProduct: { name: 'Product 1', stripeId: 'prod_1' },
          createPlan: {
            price: 1000,
            interval: BillingPeriod.MONTH,
            stripeId: 'plan_1',
            productId: 1,
            type: PlanType.RECURRING
          }
        },
        expectedResult: defaultRecurringPlan,
        setupMocks: () => {
          productRepository.getProductByStripeId.mockResolvedValue(null)
          productRepository.createProduct.mockResolvedValue(defaultProduct)
          stripeProductService.getProductById.mockResolvedValue(stripeProduct)
          planRepository.createPlan.mockResolvedValue(defaultRecurringPlan)
        }
      },
      {
        name: 'should create plan if it does not exist and a product exists',
        serviceMethodArgs: priceCreatedStripeEvent,
        expectedParams: {
          getProductByStripeId: 'prod_1',
          getStripeProductById: { id: 'prod_1' },
          createPlan: {
            price: 1000,
            interval: BillingPeriod.MONTH,
            stripeId: 'plan_1',
            productId: 1,
            type: PlanType.RECURRING
          }
        },
        expectedResult: defaultRecurringPlan,
        setupMocks: () => {
          planRepository.createPlan.mockResolvedValue(defaultRecurringPlan)
          productRepository.getProductByStripeId.mockResolvedValue(defaultProduct)
        }
      },
      {
        name: 'should throw an error if any other error occurs',
        serviceMethodArgs: priceCreatedStripeEvent,
        expectedParams: {
          getProductByStripeId: 'prod_1',
          getStripeProductById: { id: 'prod_1' },
          createPlan: {
            price: 1000,
            interval: BillingPeriod.MONTH,
            stripeId: 'plan_1',
            productId: 1,
            type: PlanType.RECURRING
          }
        },
        expectedError: { name: 'error', code: 'SOME_ANOTHER_ERROR', message: 'ERROR OCCURRED' },
        setupMocks: () => {
          planRepository.createPlan.mockRejectedValue({
            name: 'error',
            code: 'SOME_ANOTHER_ERROR',
            message: 'ERROR OCCURRED'
          })
          productRepository.getProductByStripeId.mockResolvedValue(defaultProduct)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedParams, expectedResult, expectedError, setupMocks }) => {
      setupMocks()

      const pendingResult = service.handlePriceCreated(serviceMethodArgs)
      if (expectedResult !== undefined) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      }

      expect(planRepository.createPlan).toHaveBeenCalledWith(expectedParams.createPlan)
      expect(productRepository.getProductByStripeId).toHaveBeenCalledWith(expectedParams.getProductByStripeId)

      if (expectedParams.createProduct) {
        expect(productRepository.createProduct).toHaveBeenCalledWith(expectedParams.createProduct)
      }
    })
  })

  describe('handlePlanUpdated', () => {
    it.each([
      {
        name: 'should not update plan if it does not exist',
        serviceMethodArgs: priceUpdatedStripeEvent,
        expectedParams: {
          getPlanByStripeId: 'plan_1'
        },
        expectedResult: null,
        setupMocks: () => {
          planRepository.getPlanByStripeId.mockResolvedValue(null)
        }
      },
      {
        name: 'should update plan with the new property values',
        serviceMethodArgs: priceUpdatedStripeEvent,
        expectedParams: {
          getPlanByStripeId: 'plan_1',
          updatePlan: {
            id: 1,
            interval: null,
            type: PlanType.ONE_TIME,
            price: 1500
          }
        },
        expectedResult: {
          ...defaultRecurringPlan,
          interval: null,
          type: PlanType.ONE_TIME,
          price: 1500
        },
        setupMocks: () => {
          planRepository.getPlanByStripeId.mockResolvedValue(defaultRecurringPlan)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedParams, setupMocks }) => {
      setupMocks()

      await service.handlePriceUpdated(serviceMethodArgs)

      expect(planRepository.getPlanByStripeId).toHaveBeenCalledWith(expectedParams.getPlanByStripeId)

      if (expectedParams.updatePlan) {
        expect(planRepository.updatePlan).toHaveBeenCalledWith(expectedParams.updatePlan)
      }
    })
  })

  describe('handlePlanDeleted', () => {
    it.each([
      {
        name: 'should not delete plan if it is already deleted',
        serviceMethodArgs: priceDeletedStripeEvent,
        expectedParams: {
          getPlanByStripeId: 'plan_1'
        },
        setupMocks: () => {
          planRepository.getPlanByStripeId.mockResolvedValue(null)
        }
      },
      {
        name: 'should delete plan if it exists',
        serviceMethodArgs: priceDeletedStripeEvent,
        expectedParams: {
          getPlanByStripeId: 'plan_1',
          deletePlan: 1
        },
        setupMocks: () => {
          planRepository.getPlanByStripeId.mockResolvedValue(defaultRecurringPlan)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedParams, setupMocks }) => {
      setupMocks()

      await service.handlePriceDeleted(serviceMethodArgs)

      expect(planRepository.getPlanByStripeId).toHaveBeenCalledWith(expectedParams.getPlanByStripeId)
      if (expectedParams.deletePlan) {
        expect(planRepository.deletePlan).toHaveBeenCalledWith(expectedParams.deletePlan)
      }
    })
  })
})
