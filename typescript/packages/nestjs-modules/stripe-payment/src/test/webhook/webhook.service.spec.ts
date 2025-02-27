import { Test, TestingModule } from '@nestjs/testing'
import { mockDeep, mockReset } from 'jest-mock-extended'
import { WebhookService } from '../../webhook/webhook.service.js'
import { ProductRepository } from '../../repositories/product.repository.js'
import {
  canceledCustomerSubscriptionUpdatedEvent,
  defaultCheckoutSessionMetadata,
  defaultCustomerSubscriptionUpdatedEvent,
  defaultOrganization,
  defaultProduct,
  defaultRecurringPlan,
  defaultStripeInvoice,
  defaultStripePaymentIntent,
  defaultSubscription,
  defaultTransaction,
  invalidCheckoutSessionMetadata,
  noSubscriptionInvoicePaymentFailedEvent,
  noSubscriptionInvoicePaymentSucceededEvent,
  paymentCheckoutSessionCompletedEvent,
  priceCreatedStripeEvent,
  priceDeletedStripeEvent,
  priceUpdatedStripeEvent,
  productCreatedStripeEvent,
  productDeletedStripeEvent,
  productUpdatedStripeEvent,
  setupCheckoutSessionCompletedEvent,
  stripeProduct,
  subscriptionCheckoutSessionCompletedEvent,
  subscriptionCreateInvoicePaymentSucceededEvent,
  subscriptionInvoicePaymentFailedEvent,
  subscriptionInvoicePaymentSucceededEvent,
  trialingCustomerSubscriptionUpdatedEvent
} from '../mocks/index.js'
import {
  InvoiceService as StripeInvoiceService,
  PaymentIntentService as StripePaymentIntentsService,
  ProductService as StripeProductService
} from '@dbbs/nestjs-module-stripe'
import { BillingPeriod, PlanType, SubscriptionStatusId, TransactionStatusId } from '../../enums/index.js'
import { PlanRepository } from '../../repositories/plan.repository.js'
import { SubscriptionRepository } from '../../repositories/subscription.repository.js'
import { OrganizationRepository } from '../../repositories/organization.repository.js'
import { TransactionRepository } from '../../repositories/transaction.repository.js'
import { PurchaseRepository } from '../../repositories/purchase.repository.js'
import { CheckoutSessionMetadataRepository } from '../../repositories/checkoutSessionMetadata.repository.js'
import { CheckoutSessionMetadataService } from '../../services/index.js'
import { LoggerModule } from '@dbbs/nestjs-module-logger'

describe(WebhookService.name, () => {
  let service: WebhookService

  const mockProductRepository = mockDeep<ProductRepository>()
  const mockPlanRepository = mockDeep<PlanRepository>()
  const mockSubscriptionRepository = mockDeep<SubscriptionRepository>()
  const mockOrganizationRepository = mockDeep<OrganizationRepository>()
  const mockTransactionRepository = mockDeep<TransactionRepository>()
  const mockPurchaseRepository = mockDeep<PurchaseRepository>()
  const mockStripeProductService = mockDeep<StripeProductService>()
  const mockStripeInvoiceService = mockDeep<StripeInvoiceService>()
  const mockStripePaymentIntentService = mockDeep<StripePaymentIntentsService>()
  const mockCheckoutSessionMetadataRepository = mockDeep<CheckoutSessionMetadataRepository>()
  const mockCheckoutSessionMetadataService = mockDeep<CheckoutSessionMetadataService>()

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot({})],
      providers: [
        WebhookService,
        ProductRepository,
        PlanRepository,
        SubscriptionRepository,
        OrganizationRepository,
        TransactionRepository,
        PurchaseRepository,
        StripeProductService,
        StripeInvoiceService,
        StripePaymentIntentsService,
        CheckoutSessionMetadataRepository,
        CheckoutSessionMetadataService
      ]
    })
      .overrideProvider(ProductRepository)
      .useValue(mockProductRepository)
      .overrideProvider(PlanRepository)
      .useValue(mockPlanRepository)
      .overrideProvider(SubscriptionRepository)
      .useValue(mockSubscriptionRepository)
      .overrideProvider(OrganizationRepository)
      .useValue(mockOrganizationRepository)
      .overrideProvider(TransactionRepository)
      .useValue(mockTransactionRepository)
      .overrideProvider(PurchaseRepository)
      .useValue(mockPurchaseRepository)
      .overrideProvider(StripeProductService)
      .useValue(mockStripeProductService)
      .overrideProvider(StripeInvoiceService)
      .useValue(mockStripeInvoiceService)
      .overrideProvider(StripePaymentIntentsService)
      .useValue(mockStripePaymentIntentService)
      .overrideProvider(CheckoutSessionMetadataRepository)
      .useValue(mockCheckoutSessionMetadataRepository)
      .overrideProvider(CheckoutSessionMetadataService)
      .useValue(mockCheckoutSessionMetadataService)
      .compile()

    service = module.get<WebhookService>(WebhookService)
  })

  beforeEach(() => {
    mockReset(mockProductRepository)
    mockReset(mockPlanRepository)
    mockReset(mockSubscriptionRepository)
    mockReset(mockOrganizationRepository)
    mockReset(mockTransactionRepository)
    mockReset(mockStripeProductService)
    mockReset(mockStripeInvoiceService)
    mockReset(mockStripePaymentIntentService)
    mockReset(mockCheckoutSessionMetadataRepository)
    mockReset(mockCheckoutSessionMetadataService)
  })

  describe(WebhookService.prototype.handleProductCreated.name, () => {
    it.each([
      {
        name: 'should not create product and return null if product already exists',
        serviceMethodArgs: productCreatedStripeEvent,
        expectedParams: {
          createProduct: { name: 'Product 1', stripeId: 'prod_1' }
        },
        expectedResult: null,
        setupMocks: () => {
          mockProductRepository.createProduct.mockRejectedValue({
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
          mockProductRepository.createProduct.mockResolvedValue(defaultProduct)
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
          mockProductRepository.createProduct.mockRejectedValue({
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

      expect(mockProductRepository.createProduct).toHaveBeenCalledWith(expectedParams.createProduct)
    })
  })

  describe(WebhookService.prototype.handleProductUpdated.name, () => {
    it.each([
      {
        name: 'should not update product if it does not exist',
        serviceMethodArgs: productUpdatedStripeEvent,
        expectedParams: {
          getProductByStripeId: 'prod_1'
        },
        setupMocks: () => {
          mockProductRepository.getProductByStripeId.mockResolvedValue(null)
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
          mockProductRepository.getProductByStripeId.mockResolvedValue({
            ...defaultProduct,
            id: 1,
            name: 'Old Product Name'
          })
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedParams, setupMocks }) => {
      setupMocks()

      await service.handleProductUpdated(serviceMethodArgs)

      expect(mockProductRepository.getProductByStripeId).toHaveBeenCalledWith(expectedParams.getProductByStripeId)

      if (expectedParams.updateProduct) {
        expect(mockProductRepository.updateProduct).toHaveBeenCalledWith(expectedParams.updateProduct)
      }
    })
  })

  describe(WebhookService.prototype.handleProductDeleted.name, () => {
    it.each([
      {
        name: 'should not delete product if it is already deleted',
        serviceMethodArgs: productDeletedStripeEvent,
        expectedParams: {
          getProductByStripeId: 'prod_1'
        },
        setupMocks: () => {
          mockProductRepository.getProductByStripeId.mockResolvedValue(null)
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
          mockProductRepository.getProductByStripeId.mockResolvedValue(defaultProduct)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedParams, setupMocks }) => {
      setupMocks()

      await service.handleProductDeleted(serviceMethodArgs)

      expect(mockProductRepository.getProductByStripeId).toHaveBeenCalledWith(expectedParams.getProductByStripeId)
      if (expectedParams.deleteProduct) {
        expect(mockProductRepository.deleteProduct).toHaveBeenCalledWith(expectedParams.deleteProduct)
      }
    })
  })

  describe(WebhookService.prototype.handlePriceCreated.name, () => {
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
          mockPlanRepository.createPlan.mockRejectedValue({
            name: 'error',
            code: 'SQLITE_CONSTRAINT',
            message: 'UNIQUE CONSTRAINT FAILED'
          })
          mockProductRepository.getProductByStripeId.mockResolvedValue(defaultProduct)
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
          mockProductRepository.getProductByStripeId.mockResolvedValue(null)
          mockProductRepository.createProduct.mockResolvedValue(defaultProduct)
          mockStripeProductService.getProductById.mockResolvedValue(stripeProduct)
          mockPlanRepository.createPlan.mockResolvedValue(defaultRecurringPlan)
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
          mockPlanRepository.createPlan.mockResolvedValue(defaultRecurringPlan)
          mockProductRepository.getProductByStripeId.mockResolvedValue(defaultProduct)
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
          mockPlanRepository.createPlan.mockRejectedValue({
            name: 'error',
            code: 'SOME_ANOTHER_ERROR',
            message: 'ERROR OCCURRED'
          })
          mockProductRepository.getProductByStripeId.mockResolvedValue(defaultProduct)
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

      expect(mockPlanRepository.createPlan).toHaveBeenCalledWith(expectedParams.createPlan)
      expect(mockProductRepository.getProductByStripeId).toHaveBeenCalledWith(expectedParams.getProductByStripeId)

      if (expectedParams.createProduct) {
        expect(mockProductRepository.createProduct).toHaveBeenCalledWith(expectedParams.createProduct)
      }
    })
  })

  describe(WebhookService.prototype.handlePriceUpdated.name, () => {
    it.each([
      {
        name: 'should not update plan if it does not exist',
        serviceMethodArgs: priceUpdatedStripeEvent,
        expectedParams: {
          getPlanByStripeId: 'plan_1'
        },
        expectedResult: null,
        setupMocks: () => {
          mockPlanRepository.getPlanByStripeId.mockResolvedValue(null)
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
          mockPlanRepository.getPlanByStripeId.mockResolvedValue(defaultRecurringPlan)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedParams, setupMocks }) => {
      setupMocks()

      await service.handlePriceUpdated(serviceMethodArgs)

      expect(mockPlanRepository.getPlanByStripeId).toHaveBeenCalledWith(expectedParams.getPlanByStripeId)

      if (expectedParams.updatePlan) {
        expect(mockPlanRepository.updatePlan).toHaveBeenCalledWith(expectedParams.updatePlan)
      }
    })
  })

  describe(WebhookService.prototype.handlePriceDeleted.name, () => {
    it.each([
      {
        name: 'should not delete plan if it is already deleted',
        serviceMethodArgs: priceDeletedStripeEvent,
        expectedParams: {
          getPlanByStripeId: 'plan_1'
        },
        setupMocks: () => {
          mockPlanRepository.getPlanByStripeId.mockResolvedValue(null)
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
          mockPlanRepository.getPlanByStripeId.mockResolvedValue(defaultRecurringPlan)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedParams, setupMocks }) => {
      setupMocks()

      await service.handlePriceDeleted(serviceMethodArgs)

      expect(mockPlanRepository.getPlanByStripeId).toHaveBeenCalledWith(expectedParams.getPlanByStripeId)
      if (expectedParams.deletePlan) {
        expect(mockPlanRepository.deletePlan).toHaveBeenCalledWith(expectedParams.deletePlan)
      }
    })
  })

  describe(WebhookService.prototype.handleCheckoutSessionCompleted.name, () => {
    it.each([
      {
        name: 'should skip handling if mode is setup',
        serviceMethodArgs: setupCheckoutSessionCompletedEvent,
        setupMocks: () => {}
      },
      {
        name: 'should skip handling if metadata is not found',
        serviceMethodArgs: paymentCheckoutSessionCompletedEvent,
        setupMocks: () => {
          mockCheckoutSessionMetadataRepository.getMetadataByCheckoutSessionStripeId.mockResolvedValue(null)
        }
      },
      {
        name: 'should skip handling if metadata is in the wrong format',
        serviceMethodArgs: paymentCheckoutSessionCompletedEvent,
        setupMocks: () => {
          mockCheckoutSessionMetadataRepository.getMetadataByCheckoutSessionStripeId.mockResolvedValue(
            invalidCheckoutSessionMetadata
          )
        }
      },
      {
        name: 'should handle subscription and create a transaction',
        serviceMethodArgs: subscriptionCheckoutSessionCompletedEvent,
        expectedParams: {
          transactionCreate: {
            organizationId: 1,
            subscriptionId: 1,
            stripeInvoiceId: 'inv_test',
            statusId: TransactionStatusId.COMPLETED
          }
        },
        setupMocks: () => {
          mockCheckoutSessionMetadataRepository.getMetadataByCheckoutSessionStripeId.mockResolvedValue(
            defaultCheckoutSessionMetadata
          )
          mockOrganizationRepository.getOrganizationById.mockResolvedValue(defaultOrganization)
          mockStripeInvoiceService.getInvoiceById.mockResolvedValue(defaultStripeInvoice)
          mockTransactionRepository.getTransactionByStripeInvoiceId.mockResolvedValue(null)
          mockSubscriptionRepository.createSubscription.mockResolvedValue(1)
        }
      },
      {
        name: 'should handle one-time purchase and create a transaction',
        serviceMethodArgs: paymentCheckoutSessionCompletedEvent,
        expectedParams: {
          transactionCreate: {
            organizationId: 1,
            purchaseId: 1,
            stripeInvoiceId: 'pi_test',
            statusId: TransactionStatusId.COMPLETED
          }
        },
        setupMocks: () => {
          mockCheckoutSessionMetadataRepository.getMetadataByCheckoutSessionStripeId.mockResolvedValue(
            defaultCheckoutSessionMetadata
          )
          mockOrganizationRepository.getOrganizationById.mockResolvedValue(defaultOrganization)
          mockStripePaymentIntentService.getPaymentIntentById.mockResolvedValue(defaultStripePaymentIntent)
          mockTransactionRepository.getTransactionByStripeInvoiceId.mockResolvedValue(null)
          mockPurchaseRepository.createPurchase.mockResolvedValue(1)
        }
      },
      {
        name: 'should not create transaction if it already exists',
        serviceMethodArgs: paymentCheckoutSessionCompletedEvent,
        setupMocks: () => {
          mockCheckoutSessionMetadataRepository.getMetadataByCheckoutSessionStripeId.mockResolvedValue(
            defaultCheckoutSessionMetadata
          )
          mockOrganizationRepository.getOrganizationById.mockResolvedValue(defaultOrganization)
          mockStripePaymentIntentService.getPaymentIntentById.mockResolvedValue(defaultStripePaymentIntent)
          mockTransactionRepository.getTransactionByStripeInvoiceId.mockResolvedValue(defaultTransaction)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedParams, setupMocks }) => {
      setupMocks()

      await expect(service.handleCheckoutSessionCompleted(serviceMethodArgs)).resolves.not.toThrow()

      if (expectedParams) {
        expect(mockTransactionRepository.createTransaction).toHaveBeenCalledWith(expectedParams.transactionCreate)
      } else {
        expect(mockTransactionRepository.createTransaction).not.toHaveBeenCalled()
      }
    })
  })

  describe(WebhookService.prototype.handleInvoicePaymentSucceeded.name, () => {
    it.each([
      {
        name: 'should skip handling if billing reason is subscription create',
        serviceMethodArgs: subscriptionCreateInvoicePaymentSucceededEvent,
        setupMocks: () => {}
      },
      {
        name: 'should skip handling if subscription is not found in the event',
        serviceMethodArgs: noSubscriptionInvoicePaymentSucceededEvent,
        setupMocks: () => {}
      },
      {
        name: 'should skip handling if subscription is not found in the repository',
        serviceMethodArgs: subscriptionInvoicePaymentSucceededEvent,
        setupMocks: () => {
          mockSubscriptionRepository.getSubscriptionByStripeId.mockResolvedValue(null)
        }
      },
      {
        name: 'should skip handling if subscription is already active',
        serviceMethodArgs: subscriptionInvoicePaymentSucceededEvent,
        setupMocks: () => {
          mockSubscriptionRepository.getSubscriptionByStripeId.mockResolvedValue({
            ...defaultSubscription,
            status: SubscriptionStatusId.ACTIVE
          })
        }
      },
      {
        name: 'should create a transaction and update subscription status if not already active',
        serviceMethodArgs: subscriptionInvoicePaymentSucceededEvent,
        expectedParams: {
          transactionCreate: {
            subscriptionId: 1,
            organizationId: 1,
            statusId: TransactionStatusId.COMPLETED,
            stripeInvoiceId: 'inv_test'
          },
          subscriptionUpdate: {
            subscriptionId: 1,
            statusId: SubscriptionStatusId.ACTIVE
          }
        },
        setupMocks: () => {
          mockSubscriptionRepository.getSubscriptionByStripeId.mockResolvedValue({
            ...defaultSubscription,
            status: SubscriptionStatusId.TRIALING
          })
          mockTransactionRepository.getTransactionByStripeInvoiceId.mockResolvedValue(null)
          mockTransactionRepository.createTransaction.mockResolvedValue(1)
        }
      },
      {
        name: 'should not create transaction if it already exists',
        serviceMethodArgs: subscriptionInvoicePaymentSucceededEvent,
        expectedParams: {
          subscriptionUpdate: {
            subscriptionId: 1,
            statusId: SubscriptionStatusId.ACTIVE
          }
        },
        setupMocks: () => {
          mockSubscriptionRepository.getSubscriptionByStripeId.mockResolvedValue({
            ...defaultSubscription,
            status: SubscriptionStatusId.TRIALING
          })
          mockTransactionRepository.getTransactionByStripeInvoiceId.mockResolvedValue(defaultTransaction)
        }
      },
      {
        name: 'should log and rethrow error if an exception occurs',
        serviceMethodArgs: subscriptionInvoicePaymentSucceededEvent,
        setupMocks: () => {
          mockSubscriptionRepository.getSubscriptionByStripeId.mockRejectedValue(new Error('Test error'))
        },
        expectedError: new Error('Test error')
      }
    ])('$name', async ({ serviceMethodArgs, expectedParams, expectedError, setupMocks }) => {
      setupMocks()

      const pendingResult = service.handleInvoicePaymentSucceeded(serviceMethodArgs)

      if (expectedError) {
        await expect(pendingResult).rejects.toThrow(expectedError)
      } else {
        await expect(pendingResult).resolves.not.toThrow()
      }

      if (expectedParams) {
        if (expectedParams.transactionCreate) {
          expect(mockTransactionRepository.createTransaction).toHaveBeenCalledWith(expectedParams.transactionCreate)
        }
        if (expectedParams.subscriptionUpdate) {
          expect(mockSubscriptionRepository.updateSubscriptionStatus).toHaveBeenCalledWith(
            expectedParams.subscriptionUpdate.subscriptionId,
            expectedParams.subscriptionUpdate.statusId
          )
        }
      } else {
        expect(mockTransactionRepository.createTransaction).not.toHaveBeenCalled()
        expect(mockSubscriptionRepository.updateSubscriptionStatus).not.toHaveBeenCalled()
      }
    })
  })

  describe(WebhookService.prototype.handleInvoicePaymentFailed.name, () => {
    it.each([
      {
        name: 'should skip handling if subscription is not found in the event',
        serviceMethodArgs: noSubscriptionInvoicePaymentFailedEvent,
        setupMocks: () => {}
      },
      {
        name: 'should skip handling if subscription is not found in the repository',
        serviceMethodArgs: subscriptionInvoicePaymentFailedEvent,
        setupMocks: () => {
          mockSubscriptionRepository.getSubscriptionByStripeId.mockResolvedValue(null)
        }
      },
      {
        name: 'should skip handling if subscription is already active',
        serviceMethodArgs: subscriptionInvoicePaymentFailedEvent,
        setupMocks: () => {
          mockSubscriptionRepository.getSubscriptionByStripeId.mockResolvedValue({
            ...defaultSubscription,
            status: SubscriptionStatusId.UNPAID
          })
        }
      },
      {
        name: 'should create a transaction and update subscription status if not UNPAID',
        serviceMethodArgs: subscriptionInvoicePaymentFailedEvent,
        expectedParams: {
          transactionCreate: {
            subscriptionId: 1,
            organizationId: 1,
            statusId: TransactionStatusId.COMPLETED,
            stripeInvoiceId: 'inv_test'
          },
          subscriptionUpdate: {
            subscriptionId: 1,
            statusId: SubscriptionStatusId.UNPAID
          }
        },
        setupMocks: () => {
          mockSubscriptionRepository.getSubscriptionByStripeId.mockResolvedValue({
            ...defaultSubscription,
            status: SubscriptionStatusId.TRIALING
          })
          mockTransactionRepository.getTransactionByStripeInvoiceId.mockResolvedValue(null)
          mockTransactionRepository.createTransaction.mockResolvedValue(1)
        }
      },
      {
        name: 'should not create transaction if it already exists',
        serviceMethodArgs: subscriptionInvoicePaymentFailedEvent,
        expectedParams: {
          subscriptionUpdate: {
            subscriptionId: 1,
            statusId: SubscriptionStatusId.UNPAID
          }
        },
        setupMocks: () => {
          mockSubscriptionRepository.getSubscriptionByStripeId.mockResolvedValue(defaultSubscription)
          mockTransactionRepository.getTransactionByStripeInvoiceId.mockResolvedValue(defaultTransaction)
        }
      },
      {
        name: 'should log and rethrow error if an exception occurs',
        serviceMethodArgs: subscriptionInvoicePaymentFailedEvent,
        setupMocks: () => {
          mockSubscriptionRepository.getSubscriptionByStripeId.mockRejectedValue(new Error('Test error'))
        },
        expectedError: new Error('Test error')
      }
    ])('$name', async ({ serviceMethodArgs, expectedParams, expectedError, setupMocks }) => {
      setupMocks()

      const pendingResult = service.handleInvoicePaymentFailed(serviceMethodArgs)

      if (expectedError) {
        await expect(pendingResult).rejects.toThrow(expectedError)
      } else {
        await expect(pendingResult).resolves.not.toThrow()
      }

      if (expectedParams) {
        if (expectedParams.transactionCreate) {
          expect(mockTransactionRepository.createTransaction).toHaveBeenCalledWith(expectedParams.transactionCreate)
        }
        if (expectedParams.subscriptionUpdate) {
          expect(mockSubscriptionRepository.updateSubscriptionStatus).toHaveBeenCalledWith(
            expectedParams.subscriptionUpdate.subscriptionId,
            expectedParams.subscriptionUpdate.statusId
          )
        }
      } else {
        expect(mockTransactionRepository.createTransaction).not.toHaveBeenCalled()
        expect(mockSubscriptionRepository.updateSubscriptionStatus).not.toHaveBeenCalled()
      }
    })
  })

  describe(WebhookService.prototype.handleSubscriptionUpdated.name, () => {
    it.each([
      {
        name: 'should skip handling if subscription status is TRIALING',
        serviceMethodArgs: trialingCustomerSubscriptionUpdatedEvent,
        setupMocks: () => {}
      },
      {
        name: 'should skip handling if subscription is not found in the repository',
        serviceMethodArgs: defaultCustomerSubscriptionUpdatedEvent,
        setupMocks: () => {
          mockSubscriptionRepository.getSubscriptionByStripeId.mockResolvedValue(null)
        }
      },
      {
        name: 'should skip handling if organization is not found',
        serviceMethodArgs: defaultCustomerSubscriptionUpdatedEvent,
        setupMocks: () => {
          mockSubscriptionRepository.getSubscriptionByStripeId.mockResolvedValue(defaultSubscription)
          mockOrganizationRepository.getOrganizationByStripeCustomerId.mockResolvedValue(null)
        }
      },
      {
        name: 'should update organization quantity if quantity exceeds current quantity',
        serviceMethodArgs: defaultCustomerSubscriptionUpdatedEvent,
        expectedParams: {
          organizationUpdate: { id: 1, quantity: 15 }
        },
        setupMocks: () => {
          mockSubscriptionRepository.getSubscriptionByStripeId.mockResolvedValue(defaultSubscription)
          mockOrganizationRepository.getOrganizationByStripeCustomerId.mockResolvedValue(defaultOrganization)
          mockPlanRepository.getPlanByStripeId.mockResolvedValue(null)
        }
      },
      {
        name: 'should update subscription status and plan',
        serviceMethodArgs: canceledCustomerSubscriptionUpdatedEvent,
        expectedParams: {
          organizationUpdate: { id: 1, quantity: 15 },
          subscriptionUpdateStatus: { subscriptionId: 1, statusId: SubscriptionStatusId.CANCELED },
          subscriptionUpdatePlan: { subscriptionId: 1, planId: 1 }
        },
        setupMocks: () => {
          mockSubscriptionRepository.getSubscriptionByStripeId.mockResolvedValue(defaultSubscription)
          mockOrganizationRepository.getOrganizationByStripeCustomerId.mockResolvedValue(defaultOrganization)
          mockPlanRepository.getPlanByStripeId.mockResolvedValue(defaultRecurringPlan)
        }
      },
      {
        name: 'should update subscription plan and keep status unchanged',
        serviceMethodArgs: defaultCustomerSubscriptionUpdatedEvent,
        expectedParams: {
          organizationUpdate: { id: 1, quantity: 15 },
          subscriptionUpdatePlan: { subscriptionId: 1, planId: 1 }
        },
        setupMocks: () => {
          mockSubscriptionRepository.getSubscriptionByStripeId.mockResolvedValue(defaultSubscription)
          mockOrganizationRepository.getOrganizationByStripeCustomerId.mockResolvedValue(defaultOrganization)
          mockPlanRepository.getPlanByStripeId.mockResolvedValue(defaultRecurringPlan)
        }
      },
      {
        name: 'should log and rethrow error if an exception occurs',
        serviceMethodArgs: defaultCustomerSubscriptionUpdatedEvent,
        setupMocks: () => {
          mockSubscriptionRepository.getSubscriptionByStripeId.mockRejectedValue(new Error('Test error'))
        },
        expectedError: new Error('Test error')
      }
    ])('$name', async ({ serviceMethodArgs, expectedParams, expectedError, setupMocks }) => {
      setupMocks()

      const pendingResult = service.handleSubscriptionUpdated(serviceMethodArgs)

      if (expectedError) {
        await expect(pendingResult).rejects.toThrow(expectedError)
      } else {
        await expect(pendingResult).resolves.not.toThrow()
      }

      if (expectedParams?.organizationUpdate) {
        expect(mockOrganizationRepository.updateOrganization).toHaveBeenCalledWith(expectedParams.organizationUpdate)
      } else {
        expect(mockOrganizationRepository.updateOrganization).not.toHaveBeenCalled()
      }
      if (expectedParams?.subscriptionUpdateStatus) {
        expect(mockSubscriptionRepository.updateSubscriptionStatus).toHaveBeenCalledWith(
          expectedParams.subscriptionUpdateStatus.subscriptionId,
          expectedParams.subscriptionUpdateStatus.statusId
        )
      } else {
        expect(mockSubscriptionRepository.updateSubscriptionQuantity).not.toHaveBeenCalled()
      }
      if (expectedParams?.subscriptionUpdatePlan) {
        expect(mockSubscriptionRepository.updateSubscriptionPlan).toHaveBeenCalledWith(
          expectedParams.subscriptionUpdatePlan.subscriptionId,
          expectedParams.subscriptionUpdatePlan.planId
        )
      } else {
        expect(mockSubscriptionRepository.updateSubscriptionPlan).not.toHaveBeenCalled()
      }
    })
  })
})
