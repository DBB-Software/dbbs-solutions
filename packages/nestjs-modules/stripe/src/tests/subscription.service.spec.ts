import Stripe from 'stripe'
import { SubscriptionService } from '../services/subscription.service.js'
import { Test, TestingModule } from '@nestjs/testing'
import { STRIPE_SDK } from '../constants.js'
import {
  createSessionParamsMock,
  defaultCheckoutSession,
  defaultCustomer,
  defaultPlan,
  defaultSubscription,
  getMockedMethod,
  ResourceMethods,
  ResourceName,
  subscriptionListMock
} from '../mocks/index.js'
import { PlanType } from '../enums/planType.js'
import { SessionMode } from '../enums/sessionMode.js'
import * as createHttpError from 'http-errors'
import { expect } from '@jest/globals'

describe('SubscriptionService', () => {
  let service: SubscriptionService
  let stripeMock: jest.Mocked<Stripe>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: STRIPE_SDK,
          useValue: {
            checkout: {
              sessions: {
                create: jest.fn()
              }
            },
            customers: {
              retrieve: jest.fn()
            },
            prices: {
              retrieve: jest.fn()
            },
            subscriptions: {
              create: jest.fn(),
              retrieve: jest.fn(),
              list: jest.fn(),
              update: jest.fn(),
              cancel: jest.fn()
            }
          }
        }
      ]
    }).compile()

    service = module.get<SubscriptionService>(SubscriptionService)
    stripeMock = module.get<Stripe>(STRIPE_SDK) as jest.Mocked<Stripe>
  })

  describe('Create Checkout Session', () => {
    it.each([
      {
        name: 'should create a checkout session for a recurring plan',
        serviceMethodArgs: {
          userId: 1,
          organizationName: 'Org Name',
          plan: { dbId: 1, id: 'price_1', type: PlanType.RECURRING },
          quantity: 1,
          successUrl: 'https://example.com/success',
          customerId: 'customer_1'
        },
        expectedResult: defaultCheckoutSession,
        expectedParams: {
          checkoutSessionCreate: createSessionParamsMock({
            mode: SessionMode.SUBSCRIPTION,
            planType: PlanType.RECURRING,
            customerId: 'customer_1'
          })
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.customers, 'retrieve').mockResolvedValue(defaultCustomer)
          jest.spyOn(stripeMock.prices, 'retrieve').mockResolvedValue(defaultPlan)
          jest.spyOn(stripeMock.checkout.sessions, 'create').mockResolvedValue(defaultCheckoutSession)
        }
      },
      {
        name: 'should create a checkout session for a one time plan',
        serviceMethodArgs: {
          userId: 1,
          organizationName: 'Org Name',
          plan: { dbId: 1, id: 'price_1', type: PlanType.ONE_TIME },
          quantity: 1,
          successUrl: 'https://example.com/success',
          customerId: 'customer_1'
        },
        expectedResult: defaultCheckoutSession,
        expectedParams: {
          checkoutSessionCreate: createSessionParamsMock({
            mode: SessionMode.PAYMENT,
            planType: PlanType.ONE_TIME,
            customerId: 'customer_1'
          })
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.customers, 'retrieve').mockResolvedValue(defaultCustomer)
          jest.spyOn(stripeMock.prices, 'retrieve').mockResolvedValue(defaultPlan)
          jest.spyOn(stripeMock.checkout.sessions, 'create').mockResolvedValue(defaultCheckoutSession)
        }
      },
      {
        name: 'should create a checkout session with no customer provided',
        serviceMethodArgs: {
          userId: 1,
          organizationName: 'Org Name',
          plan: { dbId: 1, id: 'price_1', type: PlanType.RECURRING },
          quantity: 1,
          successUrl: 'https://example.com/success'
        },
        expectedResult: defaultCheckoutSession,
        expectedParams: {
          checkoutSessionCreate: createSessionParamsMock({
            mode: SessionMode.SUBSCRIPTION,
            planType: PlanType.RECURRING
          })
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.customers, 'retrieve').mockResolvedValue(defaultCustomer)
          jest.spyOn(stripeMock.prices, 'retrieve').mockResolvedValue(defaultPlan)
          jest.spyOn(stripeMock.checkout.sessions, 'create').mockResolvedValue(defaultCheckoutSession)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      try {
        const result = await service.createCheckoutSession(serviceMethodArgs)
        expect(result).toEqual(expectedResult)
      } catch (error) {
        expect(error).toEqual(expectedResult)
      }

      const createCheckoutSessionMock = getMockedMethod(stripeMock, 'checkoutSessions', 'create')
      expect(createCheckoutSessionMock).toHaveBeenCalledWith(expectedParams.checkoutSessionCreate)
    })
  })

  it.each([
    {
      name: 'should throw an error if customer is not found',
      serviceMethodArgs: {
        userId: 1,
        organizationName: 'Org Name',
        plan: { dbId: 1, id: 'price_1', type: PlanType.ONE_TIME },
        quantity: 1,
        successUrl: 'https://example.com/success',
        customerId: 'customer_999'
      },
      expectedResult: new createHttpError.NotFound('Customer with ID customer_999 not found'),
      expectedParams: {
        customersRetrieve: 'customer_999'
      },
      setupMocks: () => {
        jest.spyOn(stripeMock.customers, 'retrieve').mockRejectedValue(new Error('Not Found'))
      }
    }
  ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
    setupMocks()

    try {
      await service.createCheckoutSession(serviceMethodArgs)
    } catch (error) {
      expect(error).toEqual(expectedResult)
    }

    const customerRetrieveMock = getMockedMethod(stripeMock, 'customers', 'retrieve')
    expect(customerRetrieveMock).toHaveBeenCalledWith(expectedParams.customersRetrieve)
  })

  it.each([
    {
      name: 'should throw an error if plan is not found',
      serviceMethodArgs: {
        userId: 1,
        organizationName: 'Org Name',
        plan: { dbId: 1, id: 'price_999', type: PlanType.ONE_TIME },
        quantity: 1,
        successUrl: 'https://example.com/success',
        customerId: 'customer_1'
      },
      expectedResult: new createHttpError.NotFound('Plan with ID price_999 not found'),
      expectedParams: {
        pricesRetrieve: 'price_999'
      },
      setupMocks: () => {
        jest.spyOn(stripeMock.prices, 'retrieve').mockRejectedValue(new Error('Not Found'))
      }
    }
  ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
    setupMocks()

    try {
      const result = await service.createCheckoutSession(serviceMethodArgs)
      expect(result).toEqual(expectedResult)
    } catch (error) {
      expect(error).toEqual(expectedResult)
    }

    const planRetrieveMock = getMockedMethod(stripeMock, 'prices', 'retrieve')
    expect(planRetrieveMock).toHaveBeenCalledWith(expectedParams.pricesRetrieve)
  })

  describe('Create Subscription', () => {
    it.each([
      {
        name: 'should create a subscription',
        serviceMethodArgs: { customerId: 'customer_1', planId: 'plan_1', quantity: 1 },
        expectedResult: defaultSubscription,
        expectedParams: {
          subscriptionsCreate: {
            customer: 'customer_1',
            items: [{ price: 'plan_1', quantity: 1 }]
          }
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.customers, 'retrieve').mockResolvedValue(defaultCustomer)
          jest.spyOn(stripeMock.prices, 'retrieve').mockResolvedValue(defaultPlan)
          jest.spyOn(stripeMock.subscriptions, 'create').mockResolvedValue(defaultSubscription)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      const result = await service.create(serviceMethodArgs)
      expect(result).toEqual(expectedResult)

      const subscriptionCreateMock = getMockedMethod(stripeMock, 'subscriptions', 'create')
      expect(subscriptionCreateMock).toHaveBeenCalledWith(expectedParams.subscriptionsCreate)
    })

    it.each([
      {
        name: 'should throw an error if customer is not found',
        serviceMethodArgs: { customerId: 'customer_999', planId: 'plan_1', quantity: 1 },
        expectedResult: new createHttpError.NotFound('Customer with ID customer_999 not found'),
        expectedParams: {
          customersRetrieve: 'customer_999'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.customers, 'retrieve').mockRejectedValue(new Error('Not Found'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      try {
        await service.create(serviceMethodArgs)
      } catch (error) {
        expect(error).toEqual(expectedResult)
      }

      const customerRetrieveMock = getMockedMethod(stripeMock, 'customers', 'retrieve')
      expect(customerRetrieveMock).toHaveBeenCalledWith(expectedParams.customersRetrieve)
    })

    it.each([
      {
        name: 'should throw an error if plan is not found',
        serviceMethodArgs: { customerId: 'customer_1', planId: 'plan_999', quantity: 1 },
        expectedResult: new createHttpError.NotFound('Plan with ID plan_999 not found'),
        expectedParams: {
          plansRetrieve: 'plan_999'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.prices, 'retrieve').mockRejectedValue(new Error('Not Found'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      try {
        await service.create(serviceMethodArgs)
      } catch (error) {
        expect(error).toEqual(expectedResult)
      }

      const planRetrieveMock = getMockedMethod(stripeMock, 'prices', 'retrieve')
      expect(planRetrieveMock).toHaveBeenCalledWith(expectedParams.plansRetrieve)
    })
  })

  describe('Get Subscription by ID', () => {
    it.each([
      {
        name: 'should get a subscription by id',
        serviceMethodArgs: { id: 'sub_1' },
        expectedResult: defaultSubscription,
        expectedParams: {
          subscriptionsRetrieve: 'sub_1'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.subscriptions, 'retrieve').mockResolvedValue(defaultSubscription)
        }
      },
      {
        name: 'should throw an error if subscription by id is not found',
        serviceMethodArgs: { id: 'sub_999' },
        expectedResult: new createHttpError.NotFound('Subscription with ID sub_999 not found'),
        expectedParams: {
          subscriptionsRetrieve: 'sub_999'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.subscriptions, 'retrieve').mockRejectedValue(new Error('Not Found'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      const subscriptionRetrieveMock = getMockedMethod(stripeMock, 'subscriptions', 'retrieve')
      try {
        const result = await service.getSubscriptionById(serviceMethodArgs)
        expect(result).toEqual(expectedResult)
        expect(subscriptionRetrieveMock).toHaveBeenCalledWith(expectedParams.subscriptionsRetrieve)
      } catch (error) {
        expect(error).toEqual(expectedResult)
        expect(subscriptionRetrieveMock).toHaveBeenCalledWith(expectedParams.subscriptionsRetrieve)
      }
    })
  })

  describe('Get Subscriptions', () => {
    it.each([
      {
        name: 'should get all subscriptions',
        expectedResult: subscriptionListMock.data,
        setupMocks: () => {
          jest.spyOn(stripeMock.subscriptions, 'list').mockResolvedValue(subscriptionListMock)
        }
      },
      {
        name: 'should throw an error if there is an issue fetching subscriptions',
        expectedResult: new createHttpError.NotFound('Error fetching subscriptions'),
        setupMocks: () => {
          jest.spyOn(stripeMock.subscriptions, 'list').mockRejectedValue(new Error('Fetch error'))
        }
      }
    ])('$name', async ({ expectedResult, setupMocks }) => {
      setupMocks()

      try {
        const result = await service.getSubscriptions()
        expect(result).toEqual(expectedResult)
      } catch (error) {
        expect(error).toEqual(expectedResult)
      }
    })
  })

  describe('Pause Subscription', () => {
    it.each([
      {
        name: 'should pause a subscription',
        serviceMethodArgs: { id: 'sub_1' },
        expectedResult: { ...defaultSubscription, pause_collection: { behavior: 'void', resumes_at: null } },
        expectedParams: {
          subscriptionsRetrieve: 'sub_1',
          subscriptionsUpdate: ['sub_1', { pause_collection: { behavior: 'void' } }]
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.subscriptions, 'retrieve').mockResolvedValue(defaultSubscription)
          jest.spyOn(stripeMock.subscriptions, 'update').mockResolvedValue({
            ...defaultSubscription,
            pause_collection: {
              behavior: 'void',
              resumes_at: null
            }
          })
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      const result = await service.pauseSubscription(serviceMethodArgs)
      expect(result).toEqual(expectedResult)

      const subscriptionRetrieveMock = getMockedMethod(stripeMock, 'subscriptions', 'retrieve')
      const subscriptionUpdateMock = getMockedMethod(stripeMock, 'subscriptions', 'update')

      expect(subscriptionRetrieveMock).toHaveBeenCalledWith(expectedParams.subscriptionsRetrieve)
      expect(subscriptionUpdateMock).toHaveBeenCalledWith(...expectedParams.subscriptionsUpdate)
    })

    it.each([
      {
        name: 'should throw an error if subscription is not in active state',
        serviceMethodArgs: { id: 'sub_1' },
        expectedResult: new createHttpError.BadRequest('Subscription with ID sub_1 not in active state'),
        expectedParams: {
          subscriptionsRetrieve: 'sub_1'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.subscriptions, 'retrieve').mockResolvedValue({
            ...defaultSubscription,
            pause_collection: {
              behavior: 'void',
              resumes_at: null
            }
          })
        }
      },
      {
        name: 'should throw an error if subscription is not found',
        serviceMethodArgs: { id: 'sub_999' },
        expectedResult: new createHttpError.NotFound('Subscription with ID sub_999 not found'),
        expectedParams: {
          subscriptionsRetrieve: 'sub_999'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.subscriptions, 'retrieve').mockRejectedValue(new Error('Not Found'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      try {
        await service.pauseSubscription(serviceMethodArgs)
      } catch (error) {
        expect(error).toEqual(expectedResult)
      }

      const subscriptionRetrieveMock = getMockedMethod(stripeMock, 'subscriptions', 'retrieve')
      expect(subscriptionRetrieveMock).toHaveBeenCalledWith(expectedParams.subscriptionsRetrieve)
    })
  })

  describe('Resume Subscription', () => {
    it.each([
      {
        name: 'should resume a subscription',
        serviceMethodArgs: { id: 'sub_1' },
        expectedResult: defaultSubscription,
        expectedParams: {
          subscriptionsRetrieve: 'sub_1',
          subscriptionsUpdate: ['sub_1', { pause_collection: null }]
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.subscriptions, 'retrieve').mockResolvedValue({
            ...defaultSubscription,
            pause_collection: {
              behavior: 'void',
              resumes_at: null
            }
          })
          jest.spyOn(stripeMock.subscriptions, 'update').mockResolvedValue(defaultSubscription)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      const result = await service.resumeSubscription(serviceMethodArgs)
      expect(result).toEqual(expectedResult)

      const subscriptionRetrieveMock = getMockedMethod(stripeMock, 'subscriptions', 'retrieve')
      const subscriptionUpdateMock = getMockedMethod(stripeMock, 'subscriptions', 'update')

      expect(subscriptionRetrieveMock).toHaveBeenCalledWith(expectedParams.subscriptionsRetrieve)
      expect(subscriptionUpdateMock).toHaveBeenCalledWith(...expectedParams.subscriptionsUpdate)
    })

    it.each([
      {
        name: 'should throw an error if subscription is not in paused state',
        serviceMethodArgs: { id: 'sub_1' },
        expectedResult: new createHttpError.BadRequest('Subscription with ID sub_1 not in paused state'),
        expectedParams: {
          subscriptionsRetrieve: 'sub_1'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.subscriptions, 'retrieve').mockResolvedValue(defaultSubscription)
        }
      },
      {
        name: 'should throw an error if subscription is not found',
        serviceMethodArgs: { id: 'sub_999' },
        expectedResult: new createHttpError.NotFound('Subscription with ID sub_999 not found'),
        expectedParams: {
          subscriptionsRetrieve: 'sub_999'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.subscriptions, 'retrieve').mockRejectedValue(new Error('Not Found'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      try {
        await service.resumeSubscription(serviceMethodArgs)
      } catch (error) {
        expect(error).toEqual(expectedResult)
      }

      const subscriptionRetrieveMock = getMockedMethod(stripeMock, 'subscriptions', 'retrieve')
      expect(subscriptionRetrieveMock).toHaveBeenCalledWith(expectedParams.subscriptionsRetrieve)
    })
  })

  describe('Cancel Subscription', () => {
    it.each([
      {
        name: 'should cancel a subscription',
        serviceMethodArgs: { id: 'sub_1' },
        expectedResult: { ...defaultSubscription, status: 'canceled' },
        expectedParams: {
          subscriptionsRetrieve: 'sub_1',
          subscriptionsCancel: 'sub_1'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.subscriptions, 'retrieve').mockResolvedValue(defaultSubscription)
          jest
            .spyOn(stripeMock.subscriptions, 'cancel')
            .mockResolvedValue({ ...defaultSubscription, status: 'canceled' })
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      const result = await service.cancelSubscription(serviceMethodArgs)
      expect(result).toEqual(expectedResult)

      const subscriptionRetrieveMock = getMockedMethod(stripeMock, 'subscriptions', 'retrieve')
      const subscriptionCancelMock = getMockedMethod(stripeMock, 'subscriptions', 'cancel')

      expect(subscriptionRetrieveMock).toHaveBeenCalledWith(expectedParams.subscriptionsRetrieve)
      expect(subscriptionCancelMock).toHaveBeenCalledWith(expectedParams.subscriptionsCancel)
    })

    it.each([
      {
        name: 'should throw an error if subscription is already canceled',
        serviceMethodArgs: { id: 'sub_1' },
        expectedResult: new createHttpError.BadRequest('Subscription with ID sub_1 already canceled'),
        expectedParams: {
          subscriptionsRetrieve: 'sub_1'
        },
        setupMocks: () => {
          jest
            .spyOn(stripeMock.subscriptions, 'retrieve')
            .mockResolvedValue({ ...defaultSubscription, status: 'canceled' })
        }
      },
      {
        name: 'should throw an error if subscription is not found',
        serviceMethodArgs: { id: 'sub_999' },
        expectedResult: new createHttpError.NotFound('Subscription with ID sub_999 not found'),
        expectedParams: {
          subscriptionsRetrieve: 'sub_999'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.subscriptions, 'retrieve').mockRejectedValue(new Error('Not Found'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      try {
        await service.cancelSubscription(serviceMethodArgs)
      } catch (error) {
        expect(error).toEqual(expectedResult)
      }

      const subscriptionRetrieveMock = getMockedMethod(stripeMock, 'subscriptions', 'retrieve')
      expect(subscriptionRetrieveMock).toHaveBeenCalledWith(expectedParams.subscriptionsRetrieve)
    })
  })

  describe('Update Subscription', () => {
    it.each([
      {
        name: 'should update a subscription',
        serviceMethodArgs: { id: 'sub_1', planId: 'plan_2', quantity: 2 },
        expectedResult: defaultSubscription,
        expectedParams: {
          subscriptionsRetrieve: 'sub_1',
          subscriptionsUpdate: ['sub_1', { items: [{ id: 'si_1', price: 'plan_2', quantity: 2 }] }]
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.subscriptions, 'retrieve').mockResolvedValue(defaultSubscription)
          jest.spyOn(stripeMock.subscriptions, 'update').mockResolvedValue(defaultSubscription)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      const result = await service.update(serviceMethodArgs)
      expect(result).toEqual(expectedResult)

      const subscriptionRetrieveMock = getMockedMethod(stripeMock, 'subscriptions', 'retrieve')
      const subscriptionUpdateMock = getMockedMethod(stripeMock, 'subscriptions', 'update')

      expect(subscriptionRetrieveMock).toHaveBeenCalledWith(expectedParams.subscriptionsRetrieve)
      expect(subscriptionUpdateMock).toHaveBeenCalledWith(...expectedParams.subscriptionsUpdate)
    })

    it.each([
      {
        name: 'should throw an error if subscription is not found',
        serviceMethodArgs: { id: 'sub_999', planId: 'plan_2', quantity: 2 },
        expectedResult: new createHttpError.NotFound('Subscription with ID sub_999 not found'),
        expectedParams: {
          subscriptionsRetrieve: 'sub_999'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.subscriptions, 'retrieve').mockRejectedValue(new Error('Not Found'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      try {
        await service.update(serviceMethodArgs)
      } catch (error) {
        expect(error).toEqual(expectedResult)
      }

      const subscriptionRetrieveMock = getMockedMethod(stripeMock, 'subscriptions', 'retrieve')
      expect(subscriptionRetrieveMock).toHaveBeenCalledWith(expectedParams.subscriptionsRetrieve)
    })

    it.each([
      {
        name: 'should throw an error if plan is not found',
        serviceMethodArgs: { id: 'sub_1', planId: 'plan_999', quantity: 2 },
        expectedResult: new createHttpError.NotFound('Plan with ID plan_999 not found'),
        expectedParams: {
          plansRetrieve: 'plan_999'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.subscriptions, 'retrieve').mockResolvedValue(defaultSubscription)
          jest.spyOn(stripeMock.prices, 'retrieve').mockRejectedValue(new Error('Not Found'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      try {
        await service.update(serviceMethodArgs)
      } catch (error) {
        expect(error).toEqual(expectedResult)
      }

      const planRetrieveMock = getMockedMethod(stripeMock, 'prices', 'retrieve')
      expect(planRetrieveMock).toHaveBeenCalledWith(expectedParams.plansRetrieve)
    })
  })
})
