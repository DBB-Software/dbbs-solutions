import { Test, TestingModule } from '@nestjs/testing'
import { OrganizationService } from '../services/organization.service.js'
import { STRIPE_SDK } from '../constants.js'
import Stripe from 'stripe'
import {
  defaultOrganization,
  deletedOrganization,
  getMockedMethod,
  ResourceName,
  ResourceMethods
} from '../mocks/index.js'
import createHttpError from 'http-errors'

describe('OrganizationService', () => {
  let service: OrganizationService
  let stripeMock: jest.Mocked<Stripe>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        {
          provide: STRIPE_SDK,
          useValue: {
            customers: {
              create: jest.fn(),
              update: jest.fn(),
              del: jest.fn()
            }
          }
        }
      ]
    }).compile()

    service = module.get<OrganizationService>(OrganizationService)
    stripeMock = module.get<Stripe>(STRIPE_SDK) as jest.Mocked<Stripe>
  })

  describe('Create', () => {
    it.each([
      {
        name: 'should create an organization',
        serviceMethodArgs: { name: 'Test Organization', email: 'test@org.com' },
        expectedResult: defaultOrganization,
        expectedParams: {
          customersCreate: { name: 'Test Organization', email: 'test@org.com' }
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.customers, 'create').mockResolvedValue(defaultOrganization)
        }
      },
      {
        name: 'should throw an error if failed to create an organization',
        serviceMethodArgs: { name: 'Test Organization', email: 'test@org.com' },
        expectedResult: new createHttpError.BadRequest('Failed to create an organization'),
        expectedParams: {
          customersCreate: { name: 'Test Organization', email: 'test@org.com' }
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.customers, 'create').mockRejectedValue(new Error('Failed to create'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      try {
        const result = await service.create(serviceMethodArgs)
        expect(result).toEqual(expectedResult)
      } catch (error) {
        expect(error).toEqual(expectedResult)
      }

      const mockedMethod = getMockedMethod(stripeMock, 'customers', 'create')
      expect(mockedMethod).toHaveBeenCalledWith(expectedParams.customersCreate)
    })
  })

  describe('Update', () => {
    it.each([
      {
        name: 'should update an organization',
        serviceMethodArgs: { id: 'org_1', name: 'Updated Organization' },
        expectedParams: {
          customersUpdate: ['org_1', { name: 'Updated Organization' }]
        },
        expectedResult: defaultOrganization,
        setupMocks: () => {
          jest.spyOn(stripeMock.customers, 'update').mockResolvedValue(defaultOrganization)
        }
      },
      {
        name: 'should throw an error if failed to update an organization',
        serviceMethodArgs: { id: 'org_1', name: 'Updated Organization' },
        expectedResult: new createHttpError.BadRequest('Failed to update an organization'),
        expectedParams: {
          customersUpdate: ['org_1', { name: 'Updated Organization' }]
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.customers, 'update').mockRejectedValue(new Error('Failed to update'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      try {
        const result = await service.update(serviceMethodArgs)
        expect(result).toEqual(expectedResult)
      } catch (error) {
        expect(error).toEqual(expectedResult)
      }

      const mockedMethod = getMockedMethod(stripeMock, 'customers', 'update')
      expect(mockedMethod).toHaveBeenCalledWith(...expectedParams.customersUpdate)
    })
  })

  describe('Delete', () => {
    it.each([
      {
        name: 'should delete an organization',
        serviceMethodArgs: { id: 'org_1' },
        expectedResult: deletedOrganization,
        expectedParams: {
          customersDelete: 'org_1'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.customers, 'del').mockResolvedValue(deletedOrganization)
        }
      },
      {
        name: 'should throw an error if failed to delete an organization',
        serviceMethodArgs: { id: 'org_1' },
        expectedResult: new createHttpError.BadRequest('Failed to delete an organization'),
        expectedParams: {
          customersDelete: 'org_1'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.customers, 'del').mockRejectedValue(new Error('Failed to delete'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      try {
        const result = await service.delete(serviceMethodArgs)
        expect(result).toEqual(expectedResult)
      } catch (error) {
        expect(error).toEqual(expectedResult)
      }

      const mockedMethod = getMockedMethod(stripeMock, 'customers', 'del')
      expect(mockedMethod).toHaveBeenCalledWith(expectedParams.customersDelete)
    })
  })
})
