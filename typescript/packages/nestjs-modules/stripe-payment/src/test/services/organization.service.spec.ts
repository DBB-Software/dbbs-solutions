import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException } from '@nestjs/common'
import { NotFoundError } from '@dbbs/common'
import { OrganizationService as StripeCustomerService } from '@dbbs/nestjs-module-stripe'
import { SendgridService } from '@dbbs/nestjs-module-sendgrid'
import { mockDeep, mockReset } from 'jest-mock-extended'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { InviteService, OrganizationService } from '../../services/index.js'
import { OrganizationRepository, UserRepository } from '../../repositories/index.js'
import {
  defaultOrganization,
  defaultUserEntity,
  MOCK_CREATE_ORGANIZATION_PARAMS,
  MOCK_CREATED_ORGANIZATION,
  MOCK_STRIPE_CUSTOMER,
  stripeOrganization
} from '../mocks/index.js'
import { defaultInviteEntity } from '../mocks/invite.mock.js'
import { InviteStatus } from '../../enums/invite.enum.js'

describe(OrganizationService.name, () => {
  let service: OrganizationService
  const mockStripeCustomerService = mockDeep<StripeCustomerService>()
  const mockOrganizationRepository = mockDeep<OrganizationRepository>()
  const mockUserRepository = mockDeep<UserRepository>()
  const mockSendgridService = mockDeep<SendgridService>()
  const mockInviteService = mockDeep<InviteService>()
  const mockConfigService = mockDeep<ConfigService>()

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        OrganizationService,
        StripeCustomerService,
        OrganizationRepository,
        UserRepository,
        SendgridService,
        InviteService
      ]
    })
      .overrideProvider(StripeCustomerService)
      .useValue(mockStripeCustomerService)
      .overrideProvider(OrganizationRepository)
      .useValue(mockOrganizationRepository)
      .overrideProvider(UserRepository)
      .useValue(mockUserRepository)
      .overrideProvider(SendgridService)
      .useValue(mockSendgridService)
      .overrideProvider(InviteService)
      .useValue(mockInviteService)
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile()
    service = module.get<OrganizationService>(OrganizationService)
  })

  beforeEach(() => {
    mockReset(mockStripeCustomerService)
    mockReset(mockUserRepository)
    mockReset(mockOrganizationRepository)
    mockReset(mockSendgridService)
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

  describe(OrganizationService.prototype.sendInviteToOrganization.name, () => {
    it.each<{
      name: string
      params: Parameters<typeof OrganizationService.prototype.sendInviteToOrganization>
      setupMocks: () => void
      expectedResult?: boolean
      expectedError?: Error
    }>([
      {
        name: 'should send email to unregistered user',
        params: [{ organizationId: 1, organizationName: 'Some org', recipientEmail: 'mail@gmail.com' }],
        setupMocks: () => {
          mockSendgridService.sendEmail.mockReturnThis()
        },
        expectedResult: true
      },
      {
        name: 'should send email to registered user',
        params: [{ organizationId: 1, organizationName: 'Some org', recipientEmail: 'mail@gmail.com', userId: 1 }],
        setupMocks: () => {
          mockConfigService.get.mockReturnValueOnce('dbb.com')
          mockSendgridService.sendEmail.mockReturnThis()
          mockInviteService.createInvite.mockResolvedValueOnce(defaultInviteEntity(1))
        },
        expectedResult: true
      },
      {
        name: 'should throw error if send email fails',
        params: [{ organizationId: 1, organizationName: 'Some org', recipientEmail: 'mail@gmail.com' }],
        setupMocks: () => {
          mockSendgridService.sendEmail.mockRejectedValueOnce(new Error())
        }
      }
    ])('$name', async ({ params, setupMocks, expectedResult, expectedError }) => {
      setupMocks()

      const pendingResult = service.sendInviteToOrganization(...params)

      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }
    })
  })

  describe(OrganizationService.prototype.addUserToOrganization.name, () => {
    it.each<{
      name: string
      params: Parameters<typeof OrganizationService.prototype.addUserToOrganization>
      setupMocks: () => void
      expectedResult?: boolean
      expectedError?: Error
    }>([
      {
        name: 'should add user to organization',
        params: [{ organizationId: 1, userId: 1 }],
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(defaultOrganization)
          mockUserRepository.doesUserExist.mockResolvedValueOnce(true)
          mockUserRepository.getOrganizationUsers.mockResolvedValueOnce([])
          mockOrganizationRepository.addUser.mockResolvedValueOnce(1)
        },
        expectedResult: true
      },
      {
        name: 'should throw error if organization does not exist',
        params: [{ organizationId: 1, userId: 1 }],
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(null)
        },
        expectedError: new NotFoundError('Organization with Id 1 does not exist')
      },
      {
        name: 'should throw error if user does not exist',
        params: [{ organizationId: 1, userId: 1 }],
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(defaultOrganization)
          mockUserRepository.doesUserExist.mockResolvedValueOnce(false)
        },
        expectedError: new NotFoundError('User with Id 1 does not exist')
      },
      {
        name: 'should throw error if user already exists in organization',
        params: [{ organizationId: 1, userId: 1 }],
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(defaultOrganization)
          mockUserRepository.doesUserExist.mockResolvedValueOnce(true)
          mockUserRepository.getOrganizationUsers.mockResolvedValueOnce([defaultUserEntity(1)])
        },
        expectedError: new BadRequestException(
          `User with Id 1 already exists in organization ${defaultOrganization.name}`
        )
      },
      {
        name: 'should throw error if organization quantity is exceeded',
        params: [{ organizationId: 1, userId: 1 }],
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce({ ...defaultOrganization, quantity: 1 })
          mockUserRepository.doesUserExist.mockResolvedValueOnce(true)
          mockUserRepository.getOrganizationUsers.mockResolvedValueOnce([defaultUserEntity(2)])
        },
        expectedError: new BadRequestException('Cannot add user to organization, increase your organization quantity')
      }
    ])('$name', async ({ params, setupMocks, expectedResult, expectedError }) => {
      setupMocks()

      const pendingResult = service.addUserToOrganization(...params)

      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }
    })
  })

  describe(OrganizationService.prototype.acceptInvite.name, () => {
    it.each<{
      name: string
      params: Parameters<typeof OrganizationService.prototype.acceptInvite>
      setupMocks: () => void
      expectedResult?: boolean
      expectedError?: Error
    }>([
      {
        name: 'should accept an invite',
        params: [{ inviteId: 1, userId: 1, organizationId: 1 }],
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(defaultOrganization)
          mockInviteService.getInviteById.mockResolvedValueOnce(defaultInviteEntity(1))
          mockInviteService.acceptInvite.mockResolvedValueOnce(true)
          mockUserRepository.doesUserExist.mockResolvedValueOnce(true)
          mockUserRepository.getOrganizationUsers.mockResolvedValueOnce([])
        },
        expectedResult: true
      },
      {
        name: 'should throw error if invite does not exist',
        params: [{ inviteId: 1, userId: 1, organizationId: 1 }],
        setupMocks: () => {
          mockInviteService.getInviteById.mockResolvedValueOnce(null)
        },
        expectedError: new NotFoundError(`Invite with Id 1 to organization with Id 1 for user 1 not found`)
      },
      {
        name: 'should throw error if invite already been accepted',
        params: [{ inviteId: 1, userId: 1, organizationId: 1 }],
        setupMocks: () => {
          mockInviteService.getInviteById.mockResolvedValueOnce({
            ...defaultInviteEntity(1),
            status: InviteStatus.Accepted
          })
        },
        expectedError: new BadRequestException(`Invite with Id 1 already accepted`)
      },
      {
        name: 'should throw error if invite already been cancelled',
        params: [{ inviteId: 1, userId: 1, organizationId: 1 }],
        setupMocks: () => {
          mockInviteService.getInviteById.mockResolvedValueOnce({
            ...defaultInviteEntity(1),
            status: InviteStatus.Cancelled
          })
        },
        expectedError: new BadRequestException(`Invite with Id 1 already cancelled, create new invite`)
      }
    ])('$name', async ({ params, setupMocks, expectedResult, expectedError }) => {
      setupMocks()

      const pendingResult = service.acceptInvite(...params)

      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }
    })
  })

  describe(OrganizationService.prototype.removeUserFromOrganization.name, () => {
    it.each<{
      name: string
      params: Parameters<typeof OrganizationService.prototype.removeUserFromOrganization>
      setupMocks: () => void
      expectedResult?: boolean
      expectedError?: Error
    }>([
      {
        name: 'should remove user from organization',
        params: [{ organizationId: 1, userId: 1 }],
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(defaultOrganization)
          mockUserRepository.doesUserExist.mockResolvedValueOnce(true)
          mockUserRepository.getOrganizationUsers.mockResolvedValueOnce([defaultUserEntity(1)])
          mockOrganizationRepository.removeUserFromOrganization.mockResolvedValueOnce(1)
        },
        expectedResult: true
      },
      {
        name: 'should throw error if user does not exist in organization',
        params: [{ organizationId: 1, userId: 1 }],
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(defaultOrganization)
          mockUserRepository.doesUserExist.mockResolvedValueOnce(true)
          mockUserRepository.getOrganizationUsers.mockResolvedValueOnce([])
        },
        expectedError: new BadRequestException('User with id 1 is not a member of organization')
      },
      {
        name: 'should throw error if organization does not exist',
        params: [{ organizationId: 1, userId: 1 }],
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(null)
        },
        expectedError: new NotFoundError('Organization with Id 1 does not exist')
      },
      {
        name: 'should throw error if user does not exist',
        params: [{ organizationId: 1, userId: 1 }],
        setupMocks: () => {
          mockOrganizationRepository.getOrganizationById.mockResolvedValueOnce(defaultOrganization)
          mockUserRepository.doesUserExist.mockResolvedValueOnce(false)
        },
        expectedError: new NotFoundError('User with Id 1 does not exist')
      }
    ])('$name', async ({ params, setupMocks, expectedResult, expectedError }) => {
      setupMocks()

      const pendingResult = service.removeUserFromOrganization(...params)

      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }
    })
  })
})
