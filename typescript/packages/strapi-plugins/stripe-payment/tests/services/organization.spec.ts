import createHttpError from 'http-errors'
import { Strapi } from '@strapi/strapi'
import organizationService from '../../server/services/organization'
import { createMockStrapi } from '../factories'
import {
  currency,
  defaultCheckoutSession,
  defaultOrganization,
  defaultPaymentMethod,
  strapiOrganizationServiceMock,
  updatedOrganization
} from '../mocks'

jest.mock('stripe')
jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('mocked-uuid')
}))

describe('Organization Service', () => {
  let strapi: Strapi

  beforeEach(() => {
    strapi = createMockStrapi(strapiOrganizationServiceMock)
  })

  describe('Create', () => {
    it.each([
      {
        name: 'should create an organization',
        serviceMethodArgs: { name: 'Test Organization', ownerId: '1', quantity: 1, email: 'example@gmail.com' },
        expectedResult: defaultOrganization,
        setupMocks: () => {
          jest
            .spyOn(strapi.query('plugin::users-permissions.user'), 'findOne')
            .mockResolvedValue({ id: 2 })
          jest
            .spyOn(strapi.query('plugin::stripe-payment.organization'), 'create')
            .mockResolvedValue(defaultOrganization)
          jest.spyOn(strapi.plugin('stripe-payment').service('stripe').customers, 'create').mockResolvedValue({
            id: 'cus_123',
            name: 'Test Organization'
          })
        },
        stripeServiceMethod: 'create',
        stripeServiceArgs: [{ name: 'Test Organization', email: 'example@gmail.com' }],
        queryMethod: 'create',
        queryArgs: {
          data: { name: 'Test Organization', customer_id: 'cus_123', owner_id: '1', users: ['1'], quantity: 1 }
        }
      },
      {
        name: 'should return null if the user with ownerId does not exist',
        serviceMethodArgs: { name: 'Test Organization', ownerId: '1', quantity: 1, email: 'example@gmail.com' },
        expectedResult: null,
        setupMocks: () => {
          jest
            .spyOn(strapi.query('plugin::users-permissions.user'), 'findOne')
            .mockResolvedValue(null)
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

        const result = await organizationService({ strapi }).create(serviceMethodArgs)

        if (stripeServiceMethod && stripeServiceArgs) {
          expect(strapi.plugin('stripe-payment').service('stripe').customers[stripeServiceMethod]).toBeCalledWith(
            ...stripeServiceArgs
          )
        }

        if (queryMethod && queryArgs) {
          expect(strapi.query('plugin::stripe-payment.organization')[queryMethod]).toBeCalledWith(queryArgs)
        }

        expect(result).toEqual(expectedResult)
      }
    )
  })

  describe('Get Organization By Id', () => {
    it.each([
      {
        name: 'should get an organization by id',
        serviceMethodArgs: { id: 1 },
        expectedResult: defaultOrganization,
        setupMocks: () => {
          jest
            .spyOn(strapi.query('plugin::stripe-payment.organization'), 'findOne')
            .mockResolvedValue(defaultOrganization)
        },
        queryMethod: 'findOne',
        queryArgs: {
          where: { id: 1 },
          populate: [
            'subscription',
            'subscription.plan',
            'users',
            'purchases',
            'purchases.plan',
            'purchases.plan.product'
          ]
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks, queryMethod, queryArgs }) => {
      setupMocks()

      const result = await organizationService({ strapi }).getOrganizationById(serviceMethodArgs)

      if (queryMethod && queryArgs) {
        expect(strapi.query('plugin::stripe-payment.organization')[queryMethod]).toBeCalledWith(queryArgs)
      }

      expect(result).toEqual(expectedResult)
    })

    it.each([
      {
        name: 'should return null if organization by id is not found',
        serviceMethodArgs: { id: 1 },
        expectedResult: null,
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.organization'), 'findOne').mockResolvedValue(null)
        },
        queryMethod: 'findOne',
        queryArgs: {
          where: { id: 1 },
          populate: [
            'subscription',
            'subscription.plan',
            'users',
            'purchases',
            'purchases.plan',
            'purchases.plan.product'
          ]
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks, queryMethod, queryArgs }) => {
      setupMocks()

      const result = await organizationService({ strapi }).getOrganizationById(serviceMethodArgs)

      if (queryMethod && queryArgs) {
        expect(strapi.query('plugin::stripe-payment.organization')[queryMethod]).toBeCalledWith(queryArgs)
      }

      expect(result).toEqual(expectedResult)
    })
  })

  describe('Get Organizations', () => {
    it.each([
      {
        name: 'should get all organizations',
        expectedResult: [defaultOrganization],
        setupMocks: () => {
          jest
            .spyOn(strapi.query('plugin::stripe-payment.organization'), 'findMany')
            .mockResolvedValue([defaultOrganization])
        },
        queryMethod: 'findMany',
        queryArgs: { populate: ['users'] }
      }
    ])('$name', async ({ expectedResult, setupMocks, queryMethod, queryArgs }) => {
      setupMocks()

      const result = await organizationService({ strapi }).getAllOrganizations()

      if (queryMethod && queryArgs) {
        expect(strapi.query('plugin::stripe-payment.organization')[queryMethod]).toBeCalledWith(queryArgs)
      }

      expect(result).toEqual(expectedResult)
    })
  })

  describe('Get default payment method', () => {
    it.each([
      {
        name: 'should retrieve a default payment method of an organization',
        serviceMethodArgs: { id: 1 },
        expectedResult: defaultPaymentMethod,
        setupMocks: () => {
          jest
            .spyOn(strapi.query('plugin::stripe-payment.organization'), 'findOne')
            .mockResolvedValue(defaultOrganization)
        },
        queryMethod: 'findOne',
        queryArgs: { where: { id: 1 } }
      },
      {
        name: 'should return null if organization by id is not found',
        serviceMethodArgs: { id: 1 },
        expectedResult: null,
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.organization'), 'findOne').mockResolvedValue(null)
        },
        queryMethod: 'findOne',
        queryArgs: { where: { id: 1 } }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks, queryMethod, queryArgs }) => {
      setupMocks()

      const result = await organizationService({ strapi }).getDefaultPaymentMethod(serviceMethodArgs)

      expect(strapi.query('plugin::stripe-payment.organization')[queryMethod]).toBeCalledWith(queryArgs)

      expect(result).toEqual(expectedResult)
    })
  })

  describe('Update', () => {
    it.each([
      {
        name: 'should update an organization',
        serviceMethodArgs: { id: 1, name: 'Updated Organization', quantity: 3 },
        expectedResult: updatedOrganization,
        setupMocks: () => {
          jest
            .spyOn(strapi.query('plugin::stripe-payment.organization'), 'findOne')
            .mockResolvedValue(defaultOrganization)
          jest
            .spyOn(strapi.plugin('stripe-payment').service('stripe').subscriptions, 'retrieve')
            .mockResolvedValue(updatedOrganization)
          jest
            .spyOn(strapi.query('plugin::stripe-payment.organization'), 'update')
            .mockResolvedValue(updatedOrganization)
        },
        queryMethod: 'update',
        queryArgs: { where: { id: 1 }, data: { name: 'Updated Organization', quantity: 3 } }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks, queryMethod, queryArgs }) => {
      setupMocks()

      const result = await organizationService({ strapi }).update(serviceMethodArgs)

      if (queryMethod && queryArgs) {
        expect(strapi.query('plugin::stripe-payment.organization')[queryMethod]).toBeCalledWith(queryArgs)
      }

      expect(result).toEqual(expectedResult)
    })
  })

  describe('Update default payment method', () => {
    it.each([
      {
        name: 'should return a checkout session for the new payment method setup',
        serviceMethodArgs: { id: 1, successUrl: 'https://checkout.stripe.com', currency },
        expectedResult: defaultCheckoutSession,
        setupMocks: () => {
          jest
            .spyOn(strapi.query('plugin::stripe-payment.organization'), 'findOne')
            .mockResolvedValue(defaultOrganization)
        },
        queryMethod: 'findOne',
        queryArgs: { where: { id: 1 } }
      },
      {
        name: 'should return null if organization by id is not found',
        serviceMethodArgs: { id: 1, successUrl: 'https://checkout.stripe.com', currency },
        expectedResult: null,
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.organization'), 'findOne').mockResolvedValue(null)
        },
        queryMethod: 'findOne',
        queryArgs: { where: { id: 1 } }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks, queryMethod, queryArgs }) => {
      setupMocks()

      const result = await organizationService({ strapi }).createDefaultPaymentMethodUpdateCheckoutSession(
        serviceMethodArgs
      )

      expect(strapi.query('plugin::stripe-payment.organization')[queryMethod]).toBeCalledWith(queryArgs)

      expect(result).toEqual(expectedResult)
    })
  })

  describe('Delete', () => {
    it.each([
      {
        name: 'should delete an organization',
        serviceMethodArgs: { id: 1 },
        expectedResult: { id: defaultOrganization.id },
        setupMocks: () => {
          jest
            .spyOn(strapi.query('plugin::stripe-payment.organization'), 'findOne')
            .mockResolvedValue(defaultOrganization)
          jest.spyOn(strapi.plugin('stripe-payment').service('stripe').customers, 'del').mockResolvedValue({
            id: 'cus_123',
            deleted: true
          })
        },
        stripeServiceMethod: 'del',
        stripeServiceArgs: ['cus_123'],
        queryMethod: 'delete',
        queryArgs: { where: { id: 1 } }
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

        const result = await organizationService({ strapi }).delete(serviceMethodArgs)

        if (stripeServiceMethod && stripeServiceArgs) {
          expect(strapi.plugin('stripe-payment').service('stripe').customers[stripeServiceMethod]).toBeCalledWith(
            ...stripeServiceArgs
          )
        }

        if (queryMethod && queryArgs) {
          expect(strapi.query('plugin::stripe-payment.organization')[queryMethod]).toBeCalledWith(queryArgs)
        }

        if (expectedResult !== null) {
          expect(result).toEqual(expectedResult)
        }
      }
    )
  })

  describe('Update Owner', () => {
    it.each([
      {
        name: 'should successfully update organization owner',
        serviceMethodArgs: { id: 1, ownerId: 2 },
        expectedResult: updatedOrganization,
        setupMocks: () => {
          jest
            .spyOn(strapi.query('plugin::stripe-payment.organization'), 'findOne')
            .mockResolvedValue({ ...defaultOrganization, users: [{ id: 2 }] })
          jest
            .spyOn(strapi.query('plugin::stripe-payment.organization'), 'update')
            .mockResolvedValue(updatedOrganization)
        },
        queryMethod: 'update',
        queryArgs: { where: { id: 1 }, data: { owner_id: 2 } }
      },
      {
        name: 'should throw an error if owner is not a member of the organization',
        serviceMethodArgs: { id: 1, ownerId: 2 },
        expectedError: createHttpError.BadRequest,
        setupMocks: () => {
          jest
            .spyOn(strapi.query('plugin::stripe-payment.organization'), 'findOne')
            .mockResolvedValue(defaultOrganization)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, setupMocks, queryMethod, queryArgs }) => {
      setupMocks()

      if (expectedError) {
        await expect(organizationService({ strapi }).updateOwner(serviceMethodArgs)).rejects.toThrow(expectedError)
        return
      }

      const result = await organizationService({ strapi }).updateOwner(serviceMethodArgs)
      expect(result).toEqual(expectedResult)

      expect(strapi.query('plugin::stripe-payment.organization')[queryMethod]).toBeCalledWith(queryArgs)
    })
  })

  describe('Remove User', () => {
    it.each([
      {
        name: 'should remove a user from an organization',
        serviceMethodArgs: { organizationId: 1, userId: 3 },
        expectedResult: updatedOrganization,
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.organization'), 'findOne').mockResolvedValue({
            id: 1,
            name: 'Test Organization',
            users: [
              { id: 2, username: 'user2' },
              { id: 3, username: 'user3' }
            ]
          })
          jest
            .spyOn(strapi.query('plugin::stripe-payment.organization'), 'update')
            .mockResolvedValue(updatedOrganization)
        },
        queryMethod: 'update',
        queryArgs: {
          where: { id: 1 },
          data: {
            users: [
              {
                id: 2,
                username: 'user2'
              }
            ]
          }
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks, queryMethod, queryArgs }) => {
      setupMocks()

      const result = await organizationService({ strapi }).removeUser(serviceMethodArgs)

      if (queryMethod && queryArgs) {
        expect(strapi.query('plugin::stripe-payment.organization')[queryMethod]).toBeCalledWith(queryArgs)
      }

      expect(result).toEqual(expectedResult)
    })
  })
})
