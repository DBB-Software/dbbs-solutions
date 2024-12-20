import { Test, TestingModule } from '@nestjs/testing'
import { LoggerModule } from '@dbbs/nestjs-module-logger'
import { NotFoundError } from '@dbbs/common'

import { OrganizationController } from '../../controllers/organization.controller.js'
import { OrganizationService } from '../../services/organization.service.js'
import {
  createOrganizationDto,
  defaultOrganization,
  defaultPurchase,
  defaultTransaction,
  MOCK_CREATE_ORGANIZATION_PARAMS,
  MOCK_CREATED_ORGANIZATION
} from '../mocks/index.js'
import { mockDeep, mockReset } from 'jest-mock-extended'
import { PurchaseService } from '../../services/purchase.service.js'
import { TransactionService } from '../../services/transaction.service.js'

describe(OrganizationController.name, () => {
  let controller: OrganizationController
  const mockOrganizationService = mockDeep<OrganizationService>()
  const mockPurchaseService = mockDeep<PurchaseService>()
  const mockTransactionService = mockDeep<TransactionService>()

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot({})],
      controllers: [OrganizationController],
      providers: [OrganizationService, PurchaseService, TransactionService]
    })
      .overrideProvider(OrganizationService)
      .useValue(mockOrganizationService)
      .overrideProvider(PurchaseService)
      .useValue(mockPurchaseService)
      .overrideProvider(TransactionService)
      .useValue(mockTransactionService)
      .compile()
    controller = module.get<OrganizationController>(OrganizationController)
  })

  beforeEach(() => {
    mockReset(mockOrganizationService)
    mockReset(mockPurchaseService)
    mockReset(mockTransactionService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe(OrganizationController.prototype.create.name, () => {
    it.each([
      {
        name: 'should create an organization',
        expectedParams: MOCK_CREATE_ORGANIZATION_PARAMS,
        expectedResult: MOCK_CREATED_ORGANIZATION,
        setupMocks: () => {
          mockOrganizationService.createOrganization.mockResolvedValueOnce(MOCK_CREATED_ORGANIZATION)
        }
      },
      {
        name: 'should throw an error if failed to create organization',
        expectedParams: MOCK_CREATE_ORGANIZATION_PARAMS,
        expectedError: new Error('Something went wrong'),
        setupMocks: () => {
          mockOrganizationService.createOrganization.mockRejectedValueOnce(new Error('Something went wrong'))
        }
      }
    ])('$name', async ({ expectedParams, expectedResult, setupMocks, expectedError }) => {
      setupMocks()
      const pendingResult = controller.create(expectedParams)

      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }
    })
  })

  describe(OrganizationController.prototype.getOrganizationById.name, () => {
    it.each([
      {
        name: 'should return an organization by id',
        controllerMethodArgs: 1,
        expectedResult: defaultOrganization,
        expectedParams: {
          productRetrieveById: 1
        },
        setupMocks: () => {
          mockOrganizationService.getOrganizationById.mockResolvedValueOnce(defaultOrganization)
        }
      },
      {
        name: 'should throw an error if failed to fetch organization',
        controllerMethodArgs: 1,
        expectedError: new Error('Something went wrong'),
        expectedParams: {
          productRetrieveById: 1
        },
        setupMocks: () => {
          mockOrganizationService.getOrganizationById.mockRejectedValueOnce(new Error('Something went wrong'))
        }
      },
      {
        name: 'should throw NotFound if organization does not exist',
        controllerMethodArgs: 999,
        expectedError: new NotFoundError('Organization with ID 999 was not found'),
        expectedParams: {
          productRetrieveById: 999
        },
        setupMocks: () => {
          mockOrganizationService.getOrganizationById.mockResolvedValueOnce(null)
        }
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()
      const pendingResult = controller.getOrganizationById(controllerMethodArgs)

      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }

      expect(mockOrganizationService.getOrganizationById).toHaveBeenCalledWith(expectedParams.productRetrieveById)
    })
  })

  describe(OrganizationController.prototype.getAll.name, () => {
    it.each([
      {
        name: 'should return organizations with empty options provided',
        controllerMethodArgs: {},
        expectedResult: { items: [defaultOrganization], total: 1, page: 1, perPage: 10 },
        expectedParams: { page: undefined, perPage: undefined },
        setupMocks: () => {
          mockOrganizationService.getAll.mockResolvedValueOnce({
            items: [defaultOrganization],
            total: 1,
            page: 1,
            perPage: 10
          })
        }
      },
      {
        name: 'should throw an error if failed to fetch organizations',
        controllerMethodArgs: { page: 1, perPage: 10 },
        setupMocks: () => {
          mockOrganizationService.getAll.mockRejectedValueOnce(new Error('Something went wrong'))
        },
        expectedError: new Error('Something went wrong'),
        expectedParams: { page: 1, perPage: 10 }
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      if (setupMocks) {
        setupMocks()
      }
      const pendingResult = controller.getAll(controllerMethodArgs)

      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }
      expect(mockOrganizationService.getAll).toHaveBeenCalledWith(expectedParams)
    })
  })

  describe(OrganizationController.prototype.getOrganizationPurchases.name, () => {
    it.each([
      {
        name: 'should return organization purchases',
        controllerMethodArgs: { organizationId: 1, paginationOptions: { page: 5, perPage: 4 } },
        expectedResult: { items: [defaultPurchase], total: 1, page: 5, perPage: 4 },
        expectedParams: { organizationId: 1, paginationOptions: { page: 5, perPage: 4 } },
        setupMocks: () => {
          mockPurchaseService.getOrganizationPurchases.mockResolvedValue({
            items: [defaultPurchase],
            total: 1,
            page: 5,
            perPage: 4
          })
        }
      },
      {
        name: 'should throw an error if failed to fetch purchases',
        controllerMethodArgs: { organizationId: 1, paginationOptions: { page: 1, perPage: 10 } },
        expectedError: new Error('Something went wrong'),
        expectedParams: { organizationId: 1, paginationOptions: { page: 1, perPage: 10 } },
        setupMocks: () => {
          mockPurchaseService.getOrganizationPurchases.mockRejectedValue(new Error('Something went wrong'))
        }
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = controller.getOrganizationPurchases(
        controllerMethodArgs.organizationId,
        controllerMethodArgs.paginationOptions
      )
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }

      const { organizationId, paginationOptions } = expectedParams
      expect(mockPurchaseService.getOrganizationPurchases).toHaveBeenCalledWith(organizationId, paginationOptions)
    })
  })

  describe(OrganizationController.prototype.getOrganizationTransactions.name, () => {
    it.each([
      {
        name: 'should return organization transactions',
        controllerMethodArgs: { organizationId: 1, paginationOptions: { page: 5, perPage: 4 } },
        expectedResult: { items: [defaultTransaction], total: 1, page: 5, perPage: 4 },
        expectedParams: { organizationId: 1, paginationOptions: { page: 5, perPage: 4 } },
        setupMocks: () => {
          mockTransactionService.getOrganizationTransactions.mockResolvedValue({
            items: [defaultTransaction],
            total: 1,
            page: 5,
            perPage: 4
          })
        }
      },
      {
        name: 'should throw an error if failed to fetch purchases',
        controllerMethodArgs: { organizationId: 1, paginationOptions: { page: 1, perPage: 10 } },
        expectedError: new Error('Something went wrong'),
        expectedParams: { organizationId: 1, paginationOptions: { page: 1, perPage: 10 } },
        setupMocks: () => {
          mockTransactionService.getOrganizationTransactions.mockRejectedValue(new Error('Something went wrong'))
        }
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = controller.getOrganizationTransactions(
        controllerMethodArgs.organizationId,
        controllerMethodArgs.paginationOptions
      )
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }

      const { organizationId, paginationOptions } = expectedParams
      expect(mockTransactionService.getOrganizationTransactions).toHaveBeenCalledWith(organizationId, paginationOptions)
    })
  })

  describe(OrganizationController.prototype.updateOrganizationName.name, () => {
    it.each([
      {
        name: 'should update an organization by ID',
        controllerMethodArgs: { id: 1, dto: createOrganizationDto },
        expectedResult: defaultOrganization,
        expectedParams: {
          organizationUpdate: {
            id: 1,
            name: 'Organization 1'
          }
        },
        setupMocks: () => {
          mockOrganizationService.updateOrganizationName.mockResolvedValueOnce(defaultOrganization)
        }
      },
      {
        name: 'should throw an error if failed to update an organization',
        controllerMethodArgs: { id: 1, dto: createOrganizationDto },
        expectedError: new Error('Something went wrong'),
        expectedParams: {
          organizationUpdate: {
            id: 1,
            name: 'Organization 1'
          }
        },
        setupMocks: () => {
          mockOrganizationService.updateOrganizationName.mockRejectedValueOnce(new Error('Something went wrong'))
        }
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()
      const result = controller.updateOrganizationName(controllerMethodArgs.id, controllerMethodArgs.dto)
      if (expectedResult) {
        await expect(result).resolves.toEqual(expectedResult)
      } else {
        await expect(result).rejects.toThrow(expectedError)
      }

      expect(mockOrganizationService.updateOrganizationName).toHaveBeenCalledWith(expectedParams.organizationUpdate)
    })
  })

  describe(OrganizationController.prototype.updateOrganizationQuantity.name, () => {
    it.each([
      {
        name: 'should update an organization by ID',
        controllerMethodArgs: { id: 1, dto: { quantity: 2 } },
        expectedResult: { ...defaultOrganization, quantity: 2 },
        expectedParams: {
          organizationUpdate: {
            id: 1,
            quantity: 2
          }
        },
        setupMocks: () => {
          mockOrganizationService.updateOrganizationQuantity.mockResolvedValueOnce({
            ...defaultOrganization,
            quantity: 2
          })
        }
      },
      {
        name: 'should throw an error if failed to update an organization',
        controllerMethodArgs: { id: 1, dto: { quantity: 2 } },
        expectedError: new Error('Something went wrong'),
        expectedParams: {
          organizationUpdate: {
            id: 1,
            quantity: 2
          }
        },
        setupMocks: () => {
          mockOrganizationService.updateOrganizationQuantity.mockRejectedValueOnce(new Error('Something went wrong'))
        }
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()
      const result = controller.updateOrganizationQuantity(controllerMethodArgs.id, controllerMethodArgs.dto)
      if (expectedResult) {
        await expect(result).resolves.toEqual(expectedResult)
      } else {
        await expect(result).rejects.toThrow(expectedError)
      }

      expect(mockOrganizationService.updateOrganizationQuantity).toHaveBeenCalledWith(expectedParams.organizationUpdate)
    })
  })

  describe(OrganizationController.prototype.deleteOrganization.name, () => {
    it.each([
      {
        name: 'should successfully delete an organization',
        controllerMethodArgs: 1,
        expectedParams: 1,
        setupMocks: () => {
          mockOrganizationService.deleteOrganization.mockResolvedValueOnce(true)
        }
      },
      {
        name: 'should throw an error if delete organization fails',
        controllerMethodArgs: 1,
        expectedError: new Error('Delete organization failed'),
        expectedParams: 1,
        setupMocks: () => {
          mockOrganizationService.deleteOrganization.mockRejectedValueOnce(new Error('Delete organization failed'))
        }
      }
    ])('$name', async ({ controllerMethodArgs, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = controller.deleteOrganization(controllerMethodArgs)
      if (expectedError) {
        await expect(pendingResult).rejects.toThrow(expectedError)
      } else {
        await expect(pendingResult).resolves.toBeTruthy()
      }

      expect(mockOrganizationService.deleteOrganization).toHaveBeenCalledWith(expectedParams)
    })
  })

  describe(OrganizationController.prototype.updateOrganizationOwner.name, () => {
    it.each([
      {
        name: 'should update an organization by ID',
        controllerMethodArgs: { id: 1, dto: { ownerId: 2 } },
        expectedResult: { ...defaultOrganization, ownerId: 2 },
        expectedParams: {
          organizationUpdate: {
            id: 1,
            ownerId: 2
          }
        },
        setupMocks: () => {
          mockOrganizationService.updateOrganizationOwner.mockResolvedValueOnce({ ...defaultOrganization, ownerId: 2 })
        }
      },
      {
        name: 'should throw an error if failed to update an organization',
        controllerMethodArgs: { id: 1, dto: { ownerId: 2 } },
        expectedError: new Error('Something went wrong'),
        expectedParams: {
          organizationUpdate: {
            id: 1,
            ownerId: 2
          }
        },
        setupMocks: () => {
          mockOrganizationService.updateOrganizationOwner.mockRejectedValueOnce(new Error('Something went wrong'))
        }
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = controller.updateOrganizationOwner(controllerMethodArgs.id, controllerMethodArgs.dto)

      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }

      expect(mockOrganizationService.updateOrganizationOwner).toHaveBeenCalledWith(expectedParams.organizationUpdate)
    })
  })
})
