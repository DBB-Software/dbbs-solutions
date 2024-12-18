import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException } from '@nestjs/common'
import { NotFoundError } from '@dbbs/common'
import { OrganizationService as StripeCustomerService } from '@dbbs/nestjs-module-stripe'
import { mockDeep, mockReset } from 'jest-mock-extended'

import { OrganizationService } from '../../services/organization.service.js'
import { OrganizationRepository } from '../../repositories/organization.repository.js'
import {
  defaultOrganization,
  defaultOrganizationEntity,
  MOCK_CREATE_ORGANIZATION_PARAMS,
  MOCK_CREATED_ORGANIZATION,
  MOCK_STRIPE_CUSTOMER,
  stripeOrganization
} from '../mocks/index.js'
import { UserRepository } from '../../repositories/user.repository.js'

describe(OrganizationService.name, () => {
  let service: OrganizationService
  const mockStripeCustomerService = mockDeep<StripeCustomerService>()
  const mockOrganizationRepository = mockDeep<OrganizationRepository>()
  const mockUserRepository = mockDeep<UserRepository>()

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationService, StripeCustomerService, OrganizationRepository, UserRepository]
    })
      .overrideProvider(StripeCustomerService)
      .useValue(mockStripeCustomerService)
      .overrideProvider(OrganizationRepository)
      .useValue(mockOrganizationRepository)
      .overrideProvider(UserRepository)
      .useValue(mockUserRepository)
      .compile()
    service = module.get<OrganizationService>(OrganizationService)
  })

  beforeEach(() => {
    mockReset(mockStripeCustomerService)
    mockReset(mockUserRepository)
    mockReset(mockOrganizationRepository)
  })

  describe(OrganizationService.prototype.createOrganization.name, () => {
    it.each([
      {
        name: 'should return a new organization',
        expectedParams: MOCK_CREATE_ORGANIZATION_PARAMS,
        expectedResult: MOCK_CREATED_ORGANIZATION,
        stripeCustomerServiceParams: {
          name: MOCK_CREATE_ORGANIZATION_PARAMS.name,
          email: MOCK_CREATE_ORGANIZATION_PARAMS.email
        },
        setupMock: () => {
          mockOrganizationRepository.createOrganization.mockResolvedValueOnce(MOCK_CREATED_ORGANIZATION)
          mockUserRepository.doesUserExist.mockResolvedValueOnce(true)
          mockStripeCustomerService.create.mockResolvedValueOnce(MOCK_STRIPE_CUSTOMER)
        }
      },
      {
        name: 'should throw an error if owner does not exist',
        expectedParams: MOCK_CREATE_ORGANIZATION_PARAMS,
        expectedError: new BadRequestException('User with ID 1234 does not exist'),
        setupMock: () => {
          mockUserRepository.doesUserExist.mockResolvedValueOnce(false)
        }
      }
    ])('$name', async ({ expectedResult, expectedParams, expectedError, stripeCustomerServiceParams, setupMock }) => {
      setupMock()

      const pendingResult = service.createOrganization(expectedParams)
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }

      if (stripeCustomerServiceParams) {
        expect(mockStripeCustomerService.create).toHaveBeenCalledWith(stripeCustomerServiceParams)
      }
    })
  })

  describe(OrganizationService.prototype.getAll.name, () => {
    it.each([
      {
        name: 'should return organizations and apply default pagination with no options provided',
        serviceMethodArgs: undefined,
        expectedResult: { items: [defaultOrganization], total: 1, page: 1, perPage: 10 },
        expectedParams: {
          paginationOptions: { skip: 0, limit: 10 }
        },
        setupMocks: () => {
          mockOrganizationRepository.getAll.mockResolvedValue({ organizations: [defaultOrganization], total: 1 })
        }
      },
      {
        name: 'should apply default pagination with empty options provided',
        serviceMethodArgs: {},
        expectedParams: {
          paginationOptions: { skip: 0, limit: 10 }
        },
        setupMocks: () => {
          mockOrganizationRepository.getAll.mockResolvedValue({ organizations: [defaultOrganization], total: 1 })
        }
      },
      {
        name: 'should apply custom pagination',
        serviceMethodArgs: { page: 2, perPage: 3 },
        expectedParams: {
          paginationOptions: { skip: 3, limit: 3 }
        },
        setupMocks: () => {
          mockOrganizationRepository.getAll.mockResolvedValue({ organizations: [defaultOrganization], total: 1 })
        }
      },
      {
        name: 'should apply custom page',
        serviceMethodArgs: { page: 2 },
        expectedParams: {
          paginationOptions: { skip: 10, limit: 10 }
        },
        setupMocks: () => {
          mockOrganizationRepository.getAll.mockResolvedValue({ organizations: [defaultOrganization], total: 1 })
        }
      },
      {
        name: 'should apply custom perPage',
        serviceMethodArgs: { perPage: 5 },
        expectedParams: {
          paginationOptions: { skip: 0, limit: 5 }
        },
        setupMocks: () => {
          mockOrganizationRepository.getAll.mockResolvedValue({ organizations: [defaultOrganization], total: 1 })
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = service.getAll(serviceMethodArgs)
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      }

      const { paginationOptions } = expectedParams
      expect(mockOrganizationRepository.getAll).toHaveBeenCalledWith(paginationOptions)
    })
  })

  describe(OrganizationService.prototype.getOrganizationById.name, () => {
    it.each([
      {
        name: 'should return the organization by ID',
        serviceMethodArgs: 1,
        expectedResult: defaultOrganization,
        expectedParams: {
          organizationRetrieveById: { id: 1 }
        },
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(defaultOrganization)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = service.getOrganizationById(serviceMethodArgs)
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      }

      const { id } = expectedParams.organizationRetrieveById
      expect(mockOrganizationRepository.getOrganizationById).toHaveBeenCalledWith(id)
    })
  })

  describe(OrganizationService.prototype.updateOrganizationName.name, () => {
    it.each([
      {
        name: 'should update an organization in Stripe and the repository',
        serviceMethodArgs: {
          id: 1,
          name: 'Organization 1'
        },
        expectedResult: defaultOrganization,
        expectedParams: {
          organizationRetrieveById: 1,
          stripeOrganizationUpdate: { id: '1', name: 'Organization 1' },
          organizationUpdate: { id: 1, name: 'Organization 1' }
        },
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(defaultOrganization)
          mockStripeCustomerService.update.mockResolvedValueOnce(stripeOrganization)
          mockOrganizationRepository.updateOrganization.mockResolvedValueOnce(defaultOrganization)
        }
      },
      {
        name: 'should throw an error if the organization is not found',
        serviceMethodArgs: {
          id: 999,
          name: 'Organization 1'
        },
        expectedError: new NotFoundError('Cannot update name for non-existing organization with ID 999'),
        expectedParams: {
          organizationRetrieveById: 999
        },
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(null)
        }
      },
      {
        name: 'should throw an error if organization update returns null',
        serviceMethodArgs: {
          id: 1,
          name: 'Organization 1'
        },
        expectedError: new Error('Failed to update an organization with ID 1: the database update was unsuccessful'),
        expectedParams: {
          organizationRetrieveById: 1
        },
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(defaultOrganization)
          mockOrganizationRepository.updateOrganization.mockResolvedValueOnce(null)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()
      const pendingResult = service.updateOrganizationName({
        id: serviceMethodArgs.id,
        name: serviceMethodArgs.name
      })
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
        expect(mockStripeCustomerService.update).toHaveBeenCalledWith({
          id: defaultOrganization.stripeCustomerId,
          name: expectedParams.stripeOrganizationUpdate.name
        })
        expect(mockOrganizationRepository.updateOrganization).toHaveBeenCalledWith(expectedParams.organizationUpdate)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }

      expect(mockOrganizationRepository.getOrganizationById).toHaveBeenCalledWith(
        expectedParams.organizationRetrieveById
      )
    })
  })

  describe(OrganizationService.prototype.updateOrganizationQuantity.name, () => {
    it.each([
      {
        name: 'should update an organization in the repository',
        serviceMethodArgs: {
          id: 1,
          quantity: 2
        },
        expectedResult: { ...defaultOrganization, quantity: 2 },
        expectedParams: {
          organizationRetrieveById: 1,
          organizationUpdate: { id: 1, quantity: 2 }
        },
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(defaultOrganization)
          mockOrganizationRepository.updateOrganization.mockResolvedValue({ ...defaultOrganization, quantity: 2 })
        }
      },
      {
        name: 'should throw an error if the organization is not found',
        serviceMethodArgs: {
          id: 999,
          quantity: 2
        },
        expectedError: new NotFoundError('Cannot update quantity for non-existing organization with ID 999'),
        expectedParams: {
          organizationRetrieveById: 999
        },
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(null)
        }
      },
      {
        name: 'should throw an error if organization update returns null',
        serviceMethodArgs: {
          id: 1,
          quantity: 2
        },
        expectedError: new Error('Failed to update an organization with ID 1: the database update was unsuccessful'),
        expectedParams: {
          organizationRetrieveById: 1
        },
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(defaultOrganization)
          mockOrganizationRepository.updateOrganization.mockResolvedValueOnce(null)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()
      const pendingResult = service.updateOrganizationQuantity({
        id: serviceMethodArgs.id,
        quantity: serviceMethodArgs.quantity
      })
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
        expect(mockOrganizationRepository.updateOrganization).toHaveBeenCalledWith(expectedParams.organizationUpdate)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }

      expect(mockOrganizationRepository.getOrganizationById).toHaveBeenCalledWith(
        expectedParams.organizationRetrieveById
      )
    })
  })

  describe(OrganizationService.prototype.deleteOrganization.name, () => {
    it.each([
      {
        name: 'should delete an Organization from database and Stripe',
        serviceMethodArgs: 1,
        expectedParams: {
          organizationRepositoryGetById: { id: 1, populate: false },
          stripeOrganizationServiceCancel: { id: 'org_1' },
          organizationRepositoryDelete: 1
        },
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValue(defaultOrganization)
        }
      },
      {
        name: 'should return true if the Organization is not found',
        serviceMethodArgs: 999,
        expectedParams: {
          organizationRepositoryGetById: { id: 999, populate: false }
        },
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValue(null)
        }
      },
      {
        name: 'should throw if an error occurs',
        serviceMethodArgs: 1,
        expectedError: new Error('Error deleting organization'),
        expectedParams: {
          organizationRepositoryGetById: { id: 1, populate: false },
          stripeOrganizationServiceCancel: { id: defaultOrganization.stripeCustomerId }
        },
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(defaultOrganization)
          mockStripeCustomerService.delete.mockRejectedValueOnce(new Error('Error deleting organization'))
        }
      }
    ])('$name', async ({ setupMocks, serviceMethodArgs, expectedError, expectedParams }) => {
      setupMocks()

      const pendingResult = service.deleteOrganization(serviceMethodArgs)

      if (expectedError) {
        await expect(pendingResult).rejects.toThrow(expectedError)
      } else {
        await expect(pendingResult).resolves.toBeTruthy()
      }

      const {
        organizationRepositoryGetById: { id, populate },
        stripeOrganizationServiceCancel,
        organizationRepositoryDelete
      } = expectedParams

      expect(mockOrganizationRepository.getOrganizationById).toHaveBeenCalledWith(id, populate)

      if (stripeOrganizationServiceCancel) {
        expect(mockStripeCustomerService.delete).toHaveBeenCalledWith(stripeOrganizationServiceCancel)
      }
      if (organizationRepositoryDelete) {
        expect(mockOrganizationRepository.deleteOrganization).toHaveBeenCalledWith(organizationRepositoryDelete)
      }
    })
  })

  describe(OrganizationService.prototype.getUserOrganizations.name, () => {
    it.each([
      {
        name: 'should return the organizations for an existing user',
        userId: 1,
        expectedResult: [defaultOrganization],
        setupMocks: () => {
          mockUserRepository.doesUserExist.mockResolvedValueOnce(true)
          mockOrganizationRepository.getUserOrganizations.mockResolvedValueOnce([defaultOrganization])
        }
      },
      {
        name: 'should throw an error when user does not exist',
        userId: 1,
        expectedError: new NotFoundError(`User with ID 1 does not exist`),
        setupMocks: () => {
          mockUserRepository.doesUserExist.mockResolvedValueOnce(false)
        }
      }
    ])('$name', async ({ userId, expectedResult, expectedError, setupMocks }) => {
      setupMocks()

      const pendingResult = service.getUserOrganizations(userId)

      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
        expect(mockOrganizationRepository.getUserOrganizations).toHaveBeenCalledWith(userId)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }

      expect(mockUserRepository.doesUserExist).toHaveBeenCalledWith(userId)
    })
  })

  describe(OrganizationService.prototype.updateOrganizationOwner.name, () => {
    it.each([
      {
        name: 'should update an organization in the repository',
        serviceMethodArgs: {
          id: 1,
          ownerId: 2
        },
        expectedResult: { ...defaultOrganization, ownerId: 2 },
        expectedParams: {
          organizationRetrieveById: 1,
          organizationUpdate: { id: 1, ownerId: 2 }
        },
        setupMocks: () => {
          mockUserRepository.doesUserExist.mockResolvedValueOnce(true)
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(defaultOrganization)
          mockOrganizationRepository.updateOrganization.mockResolvedValue({ ...defaultOrganization, ownerId: 2 })
        }
      },
      {
        name: 'should throw an error if the organization is not found',
        serviceMethodArgs: {
          id: 999,
          ownerId: 2
        },
        expectedError: new NotFoundError('Cannot update owner for non-existing organization with ID 999'),
        expectedParams: {
          organizationRetrieveById: 999
        },
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(null)
          mockUserRepository.doesUserExist.mockResolvedValueOnce(true)
        }
      },
      {
        name: 'should throw an error when user does not exist',
        serviceMethodArgs: {
          id: 999,
          ownerId: 2
        },
        expectedError: new NotFoundError(`User with ID 2 does not exist`),
        expectedParams: {
          organizationRetrieveById: 999
        },
        setupMocks: () => {
          mockUserRepository.doesUserExist.mockResolvedValueOnce(false)
        }
      },
      {
        name: 'should throw an error if organization update returns null',
        serviceMethodArgs: {
          id: 1,
          ownerId: 2
        },
        expectedError: new Error('Failed to update an organization with ID 1: the database update was unsuccessful'),
        expectedParams: {
          organizationRetrieveById: 1
        },
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(defaultOrganization)
          mockUserRepository.doesUserExist.mockResolvedValueOnce(true)
          mockOrganizationRepository.updateOrganization.mockResolvedValueOnce(null)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = service.updateOrganizationOwner(serviceMethodArgs)

      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
        expect(mockOrganizationRepository.updateOrganization).toHaveBeenCalledWith(expectedParams.organizationUpdate)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }
    })
  })
})
