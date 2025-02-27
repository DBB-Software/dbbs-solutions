import { jest } from '@jest/globals'
import { NotFoundError } from '@dbbs/common'
import { LoggerModule } from '@dbbs/nestjs-module-logger'
import { Test, TestingModule } from '@nestjs/testing'

import { SubscriptionController } from '../../controllers/index.js'
import { SubscriptionService } from '../../services/index.js'
import { SubscriptionStatus } from '../../enums/index.js'
import { CHECKOUT_SESSION_URL, defaultSubscription, extendedSubscription, SUCCESS_URL } from '../mocks/index.js'

describe('SubscriptionController', () => {
  let controller: SubscriptionController
  let subscriptionService: jest.Mocked<SubscriptionService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot({})],
      controllers: [SubscriptionController],
      providers: [
        {
          provide: SubscriptionService,
          useValue: {
            getSubscriptionById: jest.fn(),
            getSubscriptions: jest.fn(),
            cancelSubscription: jest.fn(),
            pauseSubscription: jest.fn(),
            resumeSubscription: jest.fn(),
            updateSubscriptionQuantity: jest.fn(),
            resubscribe: jest.fn(),
            deleteSubscription: jest.fn(),
            createCheckoutSession: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<SubscriptionController>(SubscriptionController)
    subscriptionService = module.get(SubscriptionService) as jest.Mocked<SubscriptionService>
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getSubscriptions', () => {
    it.each([
      {
        name: 'should return subscriptions and apply default pagination with empty options provided',
        controllerMethodArgs: {},
        expectedResult: { items: [extendedSubscription], total: 1, page: 1, perPage: 10 },
        expectedParams: { page: 1, perPage: 10 },
        setupMocks: () => {
          subscriptionService.getSubscriptions.mockResolvedValue({
            items: [extendedSubscription],
            total: 1,
            page: 1,
            perPage: 10
          })
        }
      },
      {
        name: 'should apply default pagination with custom options provided',
        controllerMethodArgs: { page: 5, perPage: 4 },
        expectedParams: { page: 5, perPage: 4 }
      },
      {
        name: 'should apply default pagination with custom page provided',
        controllerMethodArgs: { page: 2 },
        expectedParams: { page: 2, perPage: 10 }
      },
      {
        name: 'should apply default pagination with custom perPage provided',
        controllerMethodArgs: { perPage: 3 },
        expectedParams: { page: 1, perPage: 3 }
      },
      {
        name: 'should throw an error if failed to fetch products',
        controllerMethodArgs: { page: 1, perPage: 10 },
        expectedError: new Error('Something went wrong'),
        expectedParams: { page: 1, perPage: 10 }
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      if (setupMocks) {
        setupMocks()
      }

      try {
        const result = await controller.getSubscriptions(controllerMethodArgs)

        if (expectedResult) {
          expect(result).toEqual(expectedResult)
        }
      } catch (error) {
        expect(error).toEqual(expectedError)
      }

      expect(subscriptionService.getSubscriptions).toHaveBeenCalledWith(expectedParams)
    })
  })

  describe('getSubscriptionById', () => {
    it.each([
      {
        name: 'should return the subscription by ID',
        controllerMethodArgs: 1,
        expectedResult: extendedSubscription,
        expectedParams: {
          subscriptionRetrieveById: 1
        },
        setupMocks: () => {
          subscriptionService.getSubscriptionById.mockResolvedValue(extendedSubscription)
        }
      },
      {
        name: 'should throw an error if failed to fetch subscription',
        controllerMethodArgs: 1,
        expectedError: new Error('Something went wrong'),
        expectedParams: {
          subscriptionRetrieveById: 1
        },
        setupMocks: () => {
          subscriptionService.getSubscriptionById.mockRejectedValue(new Error('Something went wrong'))
        }
      },
      {
        name: 'should throw NotFoundError if subscription does not exist',
        controllerMethodArgs: 999,
        expectedError: new NotFoundError('Subscription with ID 999 was not found'),
        expectedParams: {
          subscriptionRetrieveById: 999
        },
        setupMocks: () => {
          subscriptionService.getSubscriptionById.mockResolvedValue(null)
        }
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()
      try {
        const result = await controller.getSubscriptionById(controllerMethodArgs)
        expect(result).toEqual(expectedResult)
      } catch (error) {
        expect(error).toEqual(expectedError)
      }
      expect(subscriptionService.getSubscriptionById).toHaveBeenCalledWith(expectedParams.subscriptionRetrieveById)
    })
  })

  describe('cancelSubscription', () => {
    it.each([
      {
        name: 'should cancel a subscription',
        controllerMethodArgs: 1,
        expectedResult: { ...defaultSubscription, status: SubscriptionStatus.CANCELED },
        expectedParams: {
          subscriptionCancel: 1
        },
        setupMocks: () => {
          subscriptionService.cancelSubscription.mockResolvedValue({
            ...defaultSubscription,
            status: SubscriptionStatus.CANCELED
          })
        }
      },
      {
        name: 'should throw an error if failed to cancel a subscription',
        controllerMethodArgs: 1,
        expectedError: new Error('Failed to cancel a subscription'),
        expectedParams: {
          subscriptionCancel: 1
        },
        setupMocks: () => {
          subscriptionService.cancelSubscription.mockRejectedValue(new Error('Failed to cancel a subscription'))
        }
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = controller.cancelSubscription(controllerMethodArgs)
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      }

      expect(subscriptionService.cancelSubscription).toHaveBeenCalledWith(expectedParams.subscriptionCancel)
    })
  })

  describe('pauseSubscription', () => {
    it.each([
      {
        name: 'should pause a subscription',
        controllerMethodArgs: 1,
        expectedResult: defaultSubscription,
        expectedParams: {
          subscriptionPause: 1
        },
        setupMocks: () => {
          subscriptionService.pauseSubscription.mockResolvedValue(defaultSubscription)
        }
      },
      {
        name: 'should throw an error if failed to pause a subscription',
        controllerMethodArgs: 1,
        expectedError: new Error('Failed to pause a subscription'),
        expectedParams: {
          subscriptionPause: 1
        },
        setupMocks: () => {
          subscriptionService.pauseSubscription.mockRejectedValue(new Error('Failed to pause a subscription'))
        }
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = controller.pauseSubscription(controllerMethodArgs)
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      }

      expect(subscriptionService.pauseSubscription).toHaveBeenCalledWith(expectedParams.subscriptionPause)
    })
  })

  describe('resumeSubscription', () => {
    it.each([
      {
        name: 'should resume a subscription',
        controllerMethodArgs: 1,
        expectedResult: defaultSubscription,
        expectedParams: {
          subscriptionResume: 1
        },
        setupMocks: () => {
          subscriptionService.resumeSubscription.mockResolvedValue(defaultSubscription)
        }
      },
      {
        name: 'should throw an error if failed to resume a subscription',
        controllerMethodArgs: 1,
        expectedError: new Error('Failed to resume a subscription'),
        expectedParams: {
          subscriptionResume: 1
        },
        setupMocks: () => {
          subscriptionService.resumeSubscription.mockRejectedValue(new Error('Failed to resume a subscription'))
        }
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = controller.resumeSubscription(controllerMethodArgs)
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      }

      expect(subscriptionService.resumeSubscription).toHaveBeenCalledWith(expectedParams.subscriptionResume)
    })
  })

  describe('updateSubscriptionQuantity', () => {
    it.each([
      {
        name: 'should successfully update a subscription quantity',
        controllerMethodArgs: {
          id: 1,
          dto: { quantity: 2 }
        },
        expectedResult: defaultSubscription,
        expectedParams: { id: 1, quantity: 2 },
        setupMocks: () => {
          subscriptionService.updateSubscriptionQuantity.mockResolvedValue(defaultSubscription)
        }
      },
      {
        name: 'should throw an error if update fails',
        controllerMethodArgs: {
          id: 1,
          dto: { quantity: 2 }
        },
        expectedError: new Error('Update failed'),
        expectedParams: { id: 1, quantity: 2 },
        setupMocks: () => {
          subscriptionService.updateSubscriptionQuantity.mockRejectedValue(new Error('Update failed'))
        }
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()
      try {
        const result = await controller.updateSubscriptionQuantity(controllerMethodArgs.id, controllerMethodArgs.dto)
        expect(result).toEqual(expectedResult)
      } catch (error) {
        expect(error).toEqual(expectedError)
      }

      const { id, quantity } = expectedParams
      expect(subscriptionService.updateSubscriptionQuantity).toHaveBeenCalledWith(id, quantity)
    })
  })

  describe('resubscribe', () => {
    it.each([
      {
        name: 'should successfully resubscribe a subscription',
        controllerMethodArgs: 1,
        expectedResult: true,
        expectedParams: 1,
        setupMocks: () => {
          subscriptionService.resubscribe.mockResolvedValue(true)
        }
      },
      {
        name: 'should throw an error if resubscribe fails',
        controllerMethodArgs: 1,
        expectedError: new Error('Resubscribe failed'),
        expectedParams: 1,
        setupMocks: () => {
          subscriptionService.resubscribe.mockRejectedValue(new Error('Resubscribe failed'))
        }
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = controller.resubscribe(controllerMethodArgs)
      if (expectedResult !== undefined) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      }

      expect(subscriptionService.resubscribe).toHaveBeenCalledWith(expectedParams)
    })
  })

  describe('createCheckoutSession', () => {
    it.each([
      {
        name: 'should successfully create a checkout session',
        controllerMethodArgs: {
          quantity: 5,
          planId: 1,
          userId: 1,
          successUrl: SUCCESS_URL,
          organizationId: 1
        },
        expectedParams: {
          quantity: 5,
          planId: 1,
          userId: 1,
          successUrl: SUCCESS_URL,
          organizationId: 1
        },
        expectedResult: CHECKOUT_SESSION_URL,
        setupMocks: () => {
          subscriptionService.createCheckoutSession.mockResolvedValue(CHECKOUT_SESSION_URL)
        }
      },
      {
        name: 'should throw an error if creating a checkout session fails',
        controllerMethodArgs: {
          quantity: 5,
          planId: 1,
          userId: 1,
          successUrl: SUCCESS_URL,
          organizationId: 2
        },
        expectedParams: {
          quantity: 5,
          planId: 1,
          userId: 1,
          successUrl: SUCCESS_URL,
          organizationId: 2
        },
        expectedError: new Error('Checkout session creation failed'),
        setupMocks: () => {
          subscriptionService.createCheckoutSession.mockRejectedValue(new Error('Checkout session creation failed'))
        }
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = controller.createCheckoutSession(controllerMethodArgs)
      if (expectedError) {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      } else {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      }

      expect(subscriptionService.createCheckoutSession).toHaveBeenCalledWith(expectedParams)
    })
  })

  describe('deleteSubscription', () => {
    it.each([
      {
        name: 'should successfully delete a user subscription',
        controllerMethodArgs: 1,
        expectedParams: 1,
        setupMocks: () => {
          subscriptionService.deleteSubscription.mockResolvedValue(true)
        }
      },
      {
        name: 'should throw an error if delete user subscription fails',
        controllerMethodArgs: 1,
        expectedError: new Error('Delete subscription failed'),
        expectedParams: 1,
        setupMocks: () => {
          subscriptionService.deleteSubscription.mockRejectedValue(new Error('Delete subscription failed'))
        }
      }
    ])('$name', async ({ controllerMethodArgs, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = controller.deleteSubscription(controllerMethodArgs)
      if (expectedError) {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      } else {
        await expect(pendingResult).resolves.toBe(true)
      }

      expect(subscriptionService.deleteSubscription).toHaveBeenCalledWith(expectedParams)
    })
  })
})
