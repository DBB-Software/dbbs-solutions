import { jest } from '@jest/globals'
import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundError } from '@dbbs/common'
import { OrganizationRepository } from '../../repositories/organization.repository.js'
import { defaultTransaction } from '../mocks/index.js'
import { TransactionService } from '../../services/transaction.service.js'
import { TransactionRepository } from '../../repositories/transaction.repository.js'

describe('TransactionService', () => {
  let service: TransactionService
  let transactionRepository: jest.Mocked<TransactionRepository>
  let organizationRepository: jest.Mocked<OrganizationRepository>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: OrganizationRepository,
          useValue: {
            organizationExists: jest.fn()
          }
        },
        {
          provide: TransactionRepository,
          useValue: {
            getOrganizationTransactions: jest.fn()
          }
        }
      ]
    }).compile()

    service = module.get<TransactionService>(TransactionService)
    transactionRepository = module.get(TransactionRepository) as jest.Mocked<TransactionRepository>
    organizationRepository = module.get(OrganizationRepository) as jest.Mocked<OrganizationRepository>
  })

  describe(TransactionService.prototype.getOrganizationTransactions.name, () => {
    it.each([
      {
        name: 'should return transactions for a given organization and apply default pagination with no options provided',
        serviceMethodArgs: { organizationId: 1 },
        expectedResult: { items: [defaultTransaction], total: 1, page: 1, perPage: 10 },
        expectedParams: {
          organizationId: 1,
          paginationOptions: { skip: 0, limit: 10 }
        },
        setupMocks: () => {
          organizationRepository.organizationExists.mockResolvedValue(true)
          transactionRepository.getOrganizationTransactions.mockResolvedValue({
            transactions: [defaultTransaction],
            total: 1
          })
        }
      },
      {
        name: 'should apply default pagination with empty options provided',
        serviceMethodArgs: { organizationId: 1, paginationOptions: {} },
        expectedParams: {
          organizationId: 1,
          paginationOptions: { skip: 0, limit: 10 }
        },
        setupMocks: () => {
          organizationRepository.organizationExists.mockResolvedValue(true)
          transactionRepository.getOrganizationTransactions.mockResolvedValue({
            transactions: [defaultTransaction],
            total: 1
          })
        }
      },
      {
        name: 'should apply custom pagination',
        serviceMethodArgs: { organizationId: 1, paginationOptions: { page: 2, perPage: 3 } },
        expectedParams: {
          organizationId: 1,
          paginationOptions: { skip: 3, limit: 3 }
        },
        setupMocks: () => {
          organizationRepository.organizationExists.mockResolvedValue(true)
          transactionRepository.getOrganizationTransactions.mockResolvedValue({
            transactions: [defaultTransaction],
            total: 1
          })
        }
      },
      {
        name: 'should apply custom page',
        serviceMethodArgs: { organizationId: 1, paginationOptions: { page: 2 } },
        expectedParams: {
          organizationId: 1,
          paginationOptions: { skip: 10, limit: 10 }
        },
        setupMocks: () => {
          organizationRepository.organizationExists.mockResolvedValue(true)
          transactionRepository.getOrganizationTransactions.mockResolvedValue({
            transactions: [defaultTransaction],
            total: 1
          })
        }
      },
      {
        name: 'should apply custom perPage',
        serviceMethodArgs: { organizationId: 1, paginationOptions: { perPage: 5 } },
        expectedParams: {
          organizationId: 1,
          paginationOptions: { skip: 0, limit: 5 }
        },
        setupMocks: () => {
          organizationRepository.organizationExists.mockResolvedValue(true)
          transactionRepository.getOrganizationTransactions.mockResolvedValue({
            transactions: [defaultTransaction],
            total: 1
          })
        }
      },
      {
        name: 'should throw an error if organization for a given transaction is not found',
        serviceMethodArgs: { organizationId: 999 },
        expectedError: new NotFoundError(`Cannot get transactions for a non-existing organization with ID 999`),
        expectedParams: {
          organizationId: 999
        },
        setupMocks: () => {
          organizationRepository.organizationExists.mockResolvedValue(false)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = service.getOrganizationTransactions(
        serviceMethodArgs.organizationId,
        serviceMethodArgs.paginationOptions
      )

      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else if (expectedError) {
        await expect(pendingResult).rejects.toThrow(expectedError)
      } else {
        await expect(pendingResult).resolves.not.toThrow()
      }

      const { organizationId, paginationOptions } = expectedParams

      expect(organizationRepository.organizationExists).toHaveBeenCalledWith(organizationId)
      if (paginationOptions) {
        expect(transactionRepository.getOrganizationTransactions).toHaveBeenCalledWith(
          organizationId,
          paginationOptions
        )
      }
    })
  })
})
