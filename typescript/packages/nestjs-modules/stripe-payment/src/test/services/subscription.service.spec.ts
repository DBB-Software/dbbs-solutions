import { jest } from '@jest/globals'
import { SubscriptionService as StripeSubscriptionService } from '@dbbs/nestjs-module-stripe'
import { Test, TestingModule } from '@nestjs/testing'
import { ArgumentError, NotFoundError } from '@dbbs/common'

import { SubscriptionService } from '../../services/index.js'
import {
  PlanRepository,
  CheckoutSessionMetadataRepository,
  UserRepository,
  OrganizationRepository,
  SubscriptionRepository
} from '../../repositories/index.js'
import { PlanType, SubscriptionStatus, SubscriptionStatusId } from '../../enums/index.js'
import {
  CHECKOUT_SESSION_URL,
  defaultCheckoutSession,
  defaultOneTimePlan,
  defaultOrganization,
  defaultRecurringPlan,
  defaultSubscription,
  extendedSubscription,
  stripeSubscription,
  SUCCESS_URL
} from '../mocks/index.js'

describe('SubscriptionService', () => {
  let service: SubscriptionService
  let subscriptionRepository: jest.Mocked<SubscriptionRepository>
  let stripeSubscriptionService: jest.Mocked<StripeSubscriptionService>
  let organizationRepository: jest.Mocked<OrganizationRepository>
  let userRepository: jest.Mocked<UserRepository>
  let planRepository: jest.Mocked<PlanRepository>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: SubscriptionRepository,
          useValue: {
            getSubscriptionById: jest.fn(),
            getSubscriptions: jest.fn(),
            updateSubscriptionStatus: jest.fn(),
            updateSubscriptionQuantity: jest.fn(),
            resubscribe: jest.fn(),
            deleteSubscription: jest.fn(),
            getStatusIdByOrganizationId: jest.fn()
          }
        },
        {
          provide: StripeSubscriptionService,
          useValue: {
            getSubscriptionById: jest.fn(),
            cancelSubscription: jest.fn(),
            pauseSubscription: jest.fn(),
            resumeSubscription: jest.fn(),
            updateQuantity: jest.fn(),
            create: jest.fn(),
            createCheckoutSession: jest.fn()
          }
        },
        {
          provide: UserRepository,
          useValue: {
            doesUserExist: jest.fn()
          }
        },
        {
          provide: OrganizationRepository,
          useValue: {
            countUsers: jest.fn(),
            getQuantity: jest.fn(),
            getOrganizationById: jest.fn(),
            organizationExistsByName: jest.fn()
          }
        },
        {
          provide: PlanRepository,
          useValue: {
            getPlanById: jest.fn()
          }
        },
        {
          provide: CheckoutSessionMetadataRepository,
          useValue: {
            saveMetadata: jest.fn()
          }
        }
      ]
    }).compile()

    service = module.get<SubscriptionService>(SubscriptionService)
    subscriptionRepository = module.get(SubscriptionRepository) as jest.Mocked<SubscriptionRepository>
    stripeSubscriptionService = module.get(StripeSubscriptionService) as jest.Mocked<StripeSubscriptionService>
    organizationRepository = module.get(OrganizationRepository) as jest.Mocked<OrganizationRepository>
    userRepository = module.get(UserRepository) as jest.Mocked<UserRepository>
    planRepository = module.get(PlanRepository) as jest.Mocked<PlanRepository>
  })

  describe('getSubscriptions', () => {
    it.each([
      {
        name: 'should return subscriptions and apply default pagination with no options provided',
        serviceMethodArgs: undefined,
        expectedResult: { items: [extendedSubscription], total: 1, page: 1, perPage: 10 },
        expectedParams: {
          paginationOptions: { skip: 0, limit: 10 }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptions.mockResolvedValue({ subscriptions: [extendedSubscription], total: 1 })
        }
      },
      {
        name: 'should apply default pagination with empty options provided',
        serviceMethodArgs: {},
        expectedParams: {
          paginationOptions: { skip: 0, limit: 10 }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptions.mockResolvedValue({ subscriptions: [extendedSubscription], total: 1 })
        }
      },
      {
        name: 'should apply custom pagination',
        serviceMethodArgs: { page: 2, perPage: 3 },
        expectedParams: {
          paginationOptions: { skip: 3, limit: 3 }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptions.mockResolvedValue({ subscriptions: [extendedSubscription], total: 1 })
        }
      },
      {
        name: 'should apply custom page',
        serviceMethodArgs: { page: 2 },
        expectedParams: {
          paginationOptions: { skip: 10, limit: 10 }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptions.mockResolvedValue({ subscriptions: [extendedSubscription], total: 1 })
        }
      },
      {
        name: 'should apply custom perPage',
        serviceMethodArgs: { perPage: 5 },
        expectedParams: {
          paginationOptions: { skip: 0, limit: 5 }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptions.mockResolvedValue({ subscriptions: [extendedSubscription], total: 1 })
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      if (setupMocks) {
        setupMocks()
      }

      const result = await service.getSubscriptions(serviceMethodArgs)

      if (expectedResult) {
        expect(result).toEqual(expectedResult)
      }

      const { paginationOptions } = expectedParams
      expect(subscriptionRepository.getSubscriptions).toHaveBeenCalledWith(paginationOptions)
    })
  })

  describe('getSubscriptionById', () => {
    it.each([
      {
        name: 'should return the subscription by ID',
        serviceMethodArgs: 1,
        expectedResult: extendedSubscription,
        expectedParams: {
          subscriptionRetrieve: { id: 1 }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(extendedSubscription)
        }
      },
      {
        name: 'should return null if subscription does not exist',
        serviceMethodArgs: 999,
        expectedResult: null,
        expectedParams: {
          subscriptionRetrieve: { id: 999 }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(null)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      const result = await service.getSubscriptionById(serviceMethodArgs)
      expect(result).toEqual(expectedResult)

      expect(subscriptionRepository.getSubscriptionById).toHaveBeenCalledWith(expectedParams.subscriptionRetrieve.id)
    })
  })
  describe('cancelSubscription', () => {
    it.each([
      {
        name: 'should cancel subscription in Stripe and db',
        serviceMethodArgs: 1,
        expectedResult: defaultSubscription,
        expectedParams: {
          subscriptionRetrieve: { id: 1, populate: false },
          stripeSubscriptionCancel: { id: 'sub_1' },
          subscriptionRepositoryUpdateStatus: { id: 1, statusId: SubscriptionStatusId.CANCELED }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(defaultSubscription)
          stripeSubscriptionService.cancelSubscription.mockResolvedValue(stripeSubscription)
          subscriptionRepository.updateSubscriptionStatus.mockResolvedValue(defaultSubscription)
        }
      },
      {
        name: 'should throw an error if subscription is not found',
        serviceMethodArgs: 999,
        expectedError: new NotFoundError(`Subscription with ID 999 was not found`),
        expectedParams: {
          subscriptionRetrieve: { id: 999, populate: false }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(null)
        }
      },
      {
        name: 'should throw an error if subscription is already canceled',
        serviceMethodArgs: 1,
        expectedError: new ArgumentError(`Subscription with ID 1 is already canceled`),
        expectedParams: {
          subscriptionRetrieve: { id: 1, populate: false }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue({
            ...defaultSubscription,
            status: SubscriptionStatusId.CANCELED
          })
        }
      },
      {
        name: 'should throw an error if updateSubscriptionStatus returns null',
        serviceMethodArgs: 1,
        expectedError: new Error('Subscription cancellation failed for ID 1: status update was unsuccessful'),
        expectedParams: {
          subscriptionRetrieve: { id: 1, populate: false }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(defaultSubscription)
          subscriptionRepository.updateSubscriptionStatus.mockResolvedValue(null)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = service.cancelSubscription(serviceMethodArgs)
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      }

      const { subscriptionRetrieve, subscriptionRepositoryUpdateStatus, stripeSubscriptionCancel } = expectedParams
      expect(subscriptionRepository.getSubscriptionById).toHaveBeenCalledWith(
        subscriptionRetrieve.id,
        subscriptionRetrieve.populate
      )
      if (stripeSubscriptionCancel) {
        expect(stripeSubscriptionService.cancelSubscription).toHaveBeenCalledWith(stripeSubscriptionCancel)
      }
      if (subscriptionRepositoryUpdateStatus) {
        expect(subscriptionRepository.updateSubscriptionStatus).toHaveBeenCalledWith(
          subscriptionRepositoryUpdateStatus.id,
          subscriptionRepositoryUpdateStatus.statusId
        )
      }
    })
  })

  describe('pauseSubscription', () => {
    it.each([
      {
        name: 'should pause subscription in Stripe and db',
        serviceMethodArgs: 1,
        expectedResult: defaultSubscription,
        expectedParams: {
          subscriptionRetrieve: { id: 1, populate: false },
          stripeSubscriptionPause: { id: 'sub_1' },
          subscriptionRepositoryUpdateStatus: { id: 1, statusId: SubscriptionStatusId.PAUSED }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(defaultSubscription)
          stripeSubscriptionService.pauseSubscription.mockResolvedValue(stripeSubscription)
          subscriptionRepository.updateSubscriptionStatus.mockResolvedValue(defaultSubscription)
        }
      },
      {
        name: 'should throw an error if subscription is not found',
        serviceMethodArgs: 999,
        expectedError: new NotFoundError(`Subscription with ID 999 was not found`),
        expectedParams: {
          subscriptionRetrieve: { id: 999, populate: false }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(null)
        }
      },
      {
        name: 'should throw an error if subscription is not in active state',
        serviceMethodArgs: 1,
        expectedError: new ArgumentError(`Subscription with ID 1 is not in active state`),
        expectedParams: {
          subscriptionRetrieve: { id: 1, populate: false }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue({
            ...defaultSubscription,
            status: SubscriptionStatusId.TRIALING
          })
        }
      },
      {
        name: 'should throw an error if updateSubscriptionStatus returns null',
        serviceMethodArgs: 1,
        expectedError: new Error('Subscription pause failed for ID 1: status update was unsuccessful'),
        expectedParams: {
          subscriptionRetrieve: { id: 1, populate: false }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(defaultSubscription)
          subscriptionRepository.updateSubscriptionStatus.mockResolvedValue(null)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = service.pauseSubscription(serviceMethodArgs)
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      }

      const { subscriptionRetrieve, subscriptionRepositoryUpdateStatus, stripeSubscriptionPause } = expectedParams
      expect(subscriptionRepository.getSubscriptionById).toHaveBeenCalledWith(
        subscriptionRetrieve.id,
        subscriptionRetrieve.populate
      )
      if (stripeSubscriptionPause) {
        expect(stripeSubscriptionService.pauseSubscription).toHaveBeenCalledWith(stripeSubscriptionPause)
      }
      if (subscriptionRepositoryUpdateStatus) {
        expect(subscriptionRepository.updateSubscriptionStatus).toHaveBeenCalledWith(
          subscriptionRepositoryUpdateStatus.id,
          subscriptionRepositoryUpdateStatus.statusId
        )
      }
    })
  })

  describe('resumeSubscription', () => {
    it.each([
      {
        name: 'should resume subscription in Stripe and db',
        serviceMethodArgs: 1,
        expectedResult: defaultSubscription,
        expectedParams: {
          subscriptionRetrieve: { id: 1, populate: false },
          stripeSubscriptionResume: { id: 'sub_1' },
          subscriptionRepositoryUpdateStatus: { id: 1, statusId: SubscriptionStatusId.ACTIVE }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue({
            ...defaultSubscription,
            status: SubscriptionStatusId.PAUSED
          })
          stripeSubscriptionService.resumeSubscription.mockResolvedValue(stripeSubscription)
          subscriptionRepository.updateSubscriptionStatus.mockResolvedValue(defaultSubscription)
        }
      },
      {
        name: 'should throw an error if subscription is not found',
        serviceMethodArgs: 999,
        expectedError: new NotFoundError(`Subscription with ID 999 was not found`),
        expectedParams: {
          subscriptionRetrieve: { id: 999, populate: false }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(null)
        }
      },
      {
        name: 'should throw an error if subscription is not in paused state',
        serviceMethodArgs: 1,
        expectedError: new ArgumentError(`Subscription with ID 1 is not in paused state`),
        expectedParams: {
          subscriptionRetrieve: { id: 1, populate: false }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(extendedSubscription)
        }
      },
      {
        name: 'should throw an error if updateSubscriptionStatus returns null',
        serviceMethodArgs: 1,
        expectedError: new Error('Subscription resume failed for ID 1: status update was unsuccessful'),
        expectedParams: {
          subscriptionRetrieve: { id: 1, populate: false }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue({
            ...defaultSubscription,
            status: SubscriptionStatusId.PAUSED
          })
          subscriptionRepository.updateSubscriptionStatus.mockResolvedValue(null)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = service.resumeSubscription(serviceMethodArgs)
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      }

      const { subscriptionRetrieve, subscriptionRepositoryUpdateStatus, stripeSubscriptionResume } = expectedParams
      expect(subscriptionRepository.getSubscriptionById).toHaveBeenCalledWith(
        subscriptionRetrieve.id,
        subscriptionRetrieve.populate
      )
      if (stripeSubscriptionResume) {
        expect(stripeSubscriptionService.resumeSubscription).toHaveBeenCalledWith(stripeSubscriptionResume)
      }
      if (subscriptionRepositoryUpdateStatus) {
        expect(subscriptionRepository.updateSubscriptionStatus).toHaveBeenCalledWith(
          subscriptionRepositoryUpdateStatus.id,
          subscriptionRepositoryUpdateStatus.statusId
        )
      }
    })
  })

  describe('updateSubscriptionQuantity', () => {
    it.each([
      {
        name: "should update the subscription's quantity",
        serviceMethodArgs: { id: 1, quantity: 6 },
        expectedParams: {
          subscriptionRetrieve: { id: 1, populate: false },
          countUsers: 1,
          getQuantity: 1,
          stripeServiceUpdateQuantity: { id: 'sub_1', quantity: 6 },
          subscriptionRepositoryQuantityUpdate: { id: 1, quantity: 6 }
        },
        expectedResult: defaultSubscription,
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(defaultSubscription)
          organizationRepository.countUsers.mockResolvedValue(3)
          organizationRepository.getQuantity.mockResolvedValue(10)
          stripeSubscriptionService.updateQuantity.mockResolvedValue(stripeSubscription)
          subscriptionRepository.updateSubscriptionQuantity.mockResolvedValue(defaultSubscription)
        }
      },
      {
        name: 'should throw NotFoundError if subscription is not found',
        serviceMethodArgs: { id: 999, quantity: 5 },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(null)
        },
        expectedError: new NotFoundError('Subscription with ID 999 was not found')
      },
      {
        name: 'should throw an Error if subscription.organization is not a number',
        serviceMethodArgs: { id: 1, quantity: 5 },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(extendedSubscription)
        },
        expectedError: new Error('Subscription data is invalid. Organization must not be populated')
      },
      {
        name: 'should throw an Error if subscription number of available seats is undefined',
        serviceMethodArgs: { id: 1, quantity: 5 },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(defaultSubscription)
          organizationRepository.countUsers.mockResolvedValue(3)
          organizationRepository.getQuantity.mockResolvedValue(undefined)
        },
        expectedError: new Error('Failed to get number of available seats for the subscription')
      },
      {
        name: 'should throw ArgumentError if quantity is less than organization users count',
        serviceMethodArgs: { id: 1, quantity: 2 },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(defaultSubscription)
          organizationRepository.countUsers.mockResolvedValue(3)
          organizationRepository.getQuantity.mockResolvedValue(10)
        },
        expectedError: new ArgumentError('Invalid quantity')
      },
      {
        name: 'should throw ArgumentError if quantity exceeds available organization seats',
        serviceMethodArgs: { id: 1, quantity: 20 },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(defaultSubscription)
          organizationRepository.countUsers.mockResolvedValue(3)
          organizationRepository.getQuantity.mockResolvedValue(10)
        },
        expectedError: new ArgumentError(
          'The new quantity exceeds the available seats in the organization. Please add more seats.'
        )
      },
      {
        name: 'should throw an error if updateSubscriptionQuantity returns null',
        serviceMethodArgs: { id: 1, quantity: 5 },
        expectedError: new Error(
          'Failed to update the quantity for subscription ID 1: the database update was unsuccessful'
        ),
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(defaultSubscription)
          organizationRepository.countUsers.mockResolvedValue(3)
          organizationRepository.getQuantity.mockResolvedValue(10)
          stripeSubscriptionService.updateQuantity.mockResolvedValue(stripeSubscription)
          subscriptionRepository.updateSubscriptionQuantity.mockResolvedValue(null)
        }
      }
    ])('$name', async ({ serviceMethodArgs, setupMocks, expectedParams, expectedResult, expectedError }) => {
      setupMocks()

      const { id, quantity } = serviceMethodArgs
      const pendingResult = service.updateSubscriptionQuantity(id, quantity)

      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      }

      if (expectedParams) {
        const {
          subscriptionRetrieve,
          countUsers,
          getQuantity,
          stripeServiceUpdateQuantity,
          subscriptionRepositoryQuantityUpdate
        } = expectedParams

        expect(subscriptionRepository.getSubscriptionById).toHaveBeenCalledWith(
          subscriptionRetrieve.id,
          subscriptionRetrieve.populate
        )

        if (countUsers) {
          expect(organizationRepository.countUsers).toHaveBeenCalledWith(countUsers)
        }
        if (getQuantity) {
          expect(organizationRepository.getQuantity).toHaveBeenCalledWith(getQuantity)
        }

        if (stripeServiceUpdateQuantity) {
          expect(stripeSubscriptionService.updateQuantity).toHaveBeenCalledWith(stripeServiceUpdateQuantity)
        }
        if (subscriptionRepositoryQuantityUpdate) {
          expect(subscriptionRepository.updateSubscriptionQuantity).toHaveBeenCalledWith(
            subscriptionRepositoryQuantityUpdate.id,
            subscriptionRepositoryQuantityUpdate.quantity
          )
        }
      }
    })
  })

  describe('resubscribe', () => {
    it.each([
      {
        name: 'should resubscribe a canceled subscription successfully',
        serviceMethodArgs: 1,
        expectedParams: {
          subscriptionRetrieve: { id: 1, populate: true },
          repositoryCountUsers: 1,
          stripeSubscriptionCreate: { quantity: 6, customerId: 'org_1', planId: 'plan_1' },
          updateDataForResubscribe: {
            id: 1,
            payload: { statusId: SubscriptionStatusId.ACTIVE, stripeId: 'sub_1', quantity: 6 }
          }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue({
            ...extendedSubscription,
            status: SubscriptionStatus.CANCELED
          })
          organizationRepository.countUsers.mockResolvedValue(6)
          stripeSubscriptionService.create.mockResolvedValue(stripeSubscription)
        }
      },
      {
        name: 'should throw NotFoundError when subscription is not found',
        serviceMethodArgs: 999,
        expectedError: new NotFoundError('Subscription with ID 999 was not found'),
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(null)
        }
      },
      {
        name: 'should throw an Error when subscription is not canceled',
        serviceMethodArgs: 1,
        expectedError: new Error(
          "Resubscription failed: Subscription is currently 'active', but only canceled subscriptions can be resubscribed"
        ),
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(extendedSubscription)
        }
      },
      {
        name: 'should throw an Error when organization, plan and status are not properly populated',
        serviceMethodArgs: 1,
        expectedError: new Error('Subscription data is invalid. Organization, Plan and Status must be populated'),
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(defaultSubscription)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedParams, expectedError, setupMocks }) => {
      setupMocks()

      const pendingResult = service.resubscribe(serviceMethodArgs)
      if (expectedError) {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      } else {
        await expect(pendingResult).resolves.toBe(true)
      }

      if (expectedParams) {
        const { subscriptionRetrieve, stripeSubscriptionCreate, updateDataForResubscribe, repositoryCountUsers } =
          expectedParams

        expect(subscriptionRepository.getSubscriptionById).toHaveBeenCalledWith(
          subscriptionRetrieve.id,
          subscriptionRetrieve.populate
        )
        expect(organizationRepository.countUsers).toHaveBeenCalledWith(repositoryCountUsers)
        expect(stripeSubscriptionService.create).toHaveBeenCalledWith(stripeSubscriptionCreate)
        expect(subscriptionRepository.resubscribe).toHaveBeenCalledWith(
          updateDataForResubscribe.id,
          updateDataForResubscribe.payload
        )
      }
    })
  })

  describe('createCheckoutSession', () => {
    it.each([
      {
        name: 'should create a checkout session successfully',
        serviceMethodArgs: {
          organizationId: 1,
          userId: 1,
          planId: 1,
          quantity: 2,
          successUrl: SUCCESS_URL
        },
        expectedParams: {
          organizationRetrieve: 1,
          planRetrieve: 1,
          stripeSubscriptionCheckoutSessionCreate: {
            successUrl: SUCCESS_URL,
            customerId: 'org_1',
            plan: {
              id: 'plan_1',
              type: PlanType.RECURRING
            },
            quantity: 2
          }
        },
        expectedResult: CHECKOUT_SESSION_URL,
        setupMocks: () => {
          organizationRepository.getOrganizationById.mockResolvedValue(defaultOrganization)
          userRepository.doesUserExist.mockResolvedValue(true)
          planRepository.getPlanById.mockResolvedValue(defaultRecurringPlan)
          stripeSubscriptionService.createCheckoutSession.mockResolvedValue(defaultCheckoutSession)
        }
      },
      {
        name: 'should throw error if organization with provided ID does not exist',
        serviceMethodArgs: {
          organizationId: 999,
          userId: 1,
          planId: 1,
          quantity: 2,
          successUrl: SUCCESS_URL
        },
        expectedError: new NotFoundError('Cannot create checkout session for non existing organization with ID 999'),
        expectedParams: {
          organizationRetrieve: 999
        },
        setupMocks: () => {
          organizationRepository.getOrganizationById.mockResolvedValue(null)
        }
      },
      {
        name: 'should throw error if plan is not found',
        serviceMethodArgs: {
          organizationId: 1,
          userId: 1,
          planId: 999,
          quantity: 2,
          successUrl: SUCCESS_URL
        },
        expectedParams: {
          organizationRetrieve: 1,
          planRetrieve: 999
        },
        expectedError: new NotFoundError('Plan with ID 999 was not found'),
        setupMocks: () => {
          organizationRepository.getOrganizationById.mockResolvedValue(defaultOrganization)
          userRepository.doesUserExist.mockResolvedValue(true)
          planRepository.getPlanById.mockResolvedValue(null)
        }
      },
      {
        name: 'should throw error if plan type is ONE_TIME',
        serviceMethodArgs: {
          organizationId: 1,
          userId: 1,
          planId: 1,
          quantity: 2,
          successUrl: SUCCESS_URL
        },
        expectedParams: {
          organizationRetrieve: 1,
          planRetrieve: 1
        },
        expectedError: new Error('Creating a checkout session for a one-time plan is not allowed'),
        setupMocks: () => {
          organizationRepository.getOrganizationById.mockResolvedValue(defaultOrganization)
          userRepository.doesUserExist.mockResolvedValue(true)
          planRepository.getPlanById.mockResolvedValue(defaultOneTimePlan)
        }
      },
      {
        name: 'should throw error if checkout session URL is null',
        serviceMethodArgs: {
          organizationId: 1,
          userId: 1,
          planId: 1,
          quantity: 2,
          successUrl: SUCCESS_URL
        },
        expectedParams: {
          organizationRetrieve: 1,
          planRetrieve: 1,
          stripeSubscriptionCheckoutSessionCreate: {
            successUrl: SUCCESS_URL,
            plan: {
              id: 'plan_1',
              type: PlanType.RECURRING
            },
            customerId: 'org_1',
            quantity: 2
          }
        },
        expectedError: new Error('Checkout session was created, but no URL was returned'),
        setupMocks: () => {
          organizationRepository.getOrganizationById.mockResolvedValue(defaultOrganization)
          userRepository.doesUserExist.mockResolvedValue(true)
          planRepository.getPlanById.mockResolvedValue(defaultRecurringPlan)
          stripeSubscriptionService.createCheckoutSession.mockResolvedValue({
            ...defaultCheckoutSession,
            url: null
          })
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedParams, expectedResult, expectedError, setupMocks }) => {
      setupMocks()

      const pendingResult = service.createCheckoutSession(serviceMethodArgs)
      if (expectedError) {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      } else {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      }

      const { organizationRetrieve, planRetrieve, stripeSubscriptionCheckoutSessionCreate } = expectedParams

      if (organizationRetrieve) {
        expect(organizationRepository.getOrganizationById).toHaveBeenCalledWith(organizationRetrieve)
      }
      if (planRetrieve) {
        expect(planRepository.getPlanById).toHaveBeenCalledWith(planRetrieve)
      }
      if (stripeSubscriptionCheckoutSessionCreate) {
        expect(stripeSubscriptionService.createCheckoutSession).toHaveBeenCalledWith(
          stripeSubscriptionCheckoutSessionCreate
        )
      }
    })
  })

  describe('deleteSubscription', () => {
    it.each([
      {
        name: 'should delete a Subscription from database and Stripe',
        serviceMethodArgs: 1,
        expectedParams: {
          subscriptionRepositoryGetById: { id: 1, populate: false },
          stripeSubscriptionServiceCancel: { id: 'sub_1' },
          subscriptionRepositoryDelete: 1
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(defaultSubscription)
        }
      },
      {
        name: 'should return true if the subscription is not found',
        serviceMethodArgs: 999,
        expectedParams: {
          subscriptionRepositoryGetById: { id: 999, populate: false }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(null)
        }
      },
      {
        name: 'should return true if the subscription status is CANCELED',
        serviceMethodArgs: 1,
        expectedParams: {
          subscriptionRepositoryGetById: { id: 1, populate: false }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue({
            ...defaultSubscription,
            status: SubscriptionStatusId.CANCELED
          })
        }
      },
      {
        name: 'should throw if an error occurs',
        serviceMethodArgs: 1,
        expectedError: new Error('Error deleting subscription'),
        expectedParams: {
          subscriptionRepositoryGetById: { id: 1, populate: false },
          stripeSubscriptionServiceCancel: { id: 'sub_1' }
        },
        setupMocks: () => {
          subscriptionRepository.getSubscriptionById.mockResolvedValue(defaultSubscription)
          stripeSubscriptionService.cancelSubscription.mockRejectedValue(new Error('Error deleting subscription'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = service.deleteSubscription(serviceMethodArgs)
      if (expectedError) {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      } else {
        await expect(pendingResult).resolves.toBe(true)
      }

      const {
        subscriptionRepositoryGetById: { id, populate },
        stripeSubscriptionServiceCancel,
        subscriptionRepositoryDelete
      } = expectedParams

      expect(subscriptionRepository.getSubscriptionById).toHaveBeenCalledWith(id, populate)
      if (stripeSubscriptionServiceCancel) {
        expect(stripeSubscriptionService.cancelSubscription).toHaveBeenCalledWith(stripeSubscriptionServiceCancel)
      }
      if (subscriptionRepositoryDelete) {
        expect(subscriptionRepository.deleteSubscription).toHaveBeenCalledWith(subscriptionRepositoryDelete)
      }
    })
  })
})
