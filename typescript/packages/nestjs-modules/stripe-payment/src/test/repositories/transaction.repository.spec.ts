import knex from 'knex'

import { TransactionRepository } from '../../repositories/index.js'
import {
  createOrganizationsTable,
  createTransactionStatusesTable,
  createTransactionsTable,
  createPurchasesTable
} from '../factories/database.js'
import { dbOrganizationsList, dbPurchasesList, dbTransactionsList, defaultTransactionEntity } from '../mocks/index.js'
import { TEST_DB_PATH } from '../../constants.js'

describe('TransactionRepository', () => {
  let transactionRepository: TransactionRepository
  let db: knex.Knex

  const baseId = Date.now()
  const getId = (id: number) => id + baseId

  beforeAll(async () => {
    db = knex({
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: TEST_DB_PATH
      }
    })

    transactionRepository = new TransactionRepository(db)

    await createOrganizationsTable(db, dbOrganizationsList(baseId))
    await createPurchasesTable(db, dbPurchasesList(baseId))
    await createTransactionStatusesTable(db)
    await createTransactionsTable(db, dbTransactionsList(baseId))
  })

  describe(TransactionRepository.prototype.getTransactionByStripeInvoiceId.name, () => {
    const testCases = [
      {
        description: 'should return a transaction by Stripe Invoice ID',
        repositoryMethodArgs: `inv_${getId(1)}`,
        expectedResult: defaultTransactionEntity(baseId)
      },
      {
        description: 'should return null if transaction with provided Stripe Invoice ID does not exist',
        repositoryMethodArgs: `inv_${getId(999)}`,
        expectedResult: null
      }
    ]

    test.each(testCases)('$description', async ({ repositoryMethodArgs, expectedResult }) => {
      const result = await transactionRepository.getTransactionByStripeInvoiceId(repositoryMethodArgs)

      expect(result).toEqual(expectedResult)
    })
  })

  describe(`${TransactionRepository.prototype.getOrganizationTransactions.name}`, () => {
    const testCases = [
      {
        description: 'should return all transactions for the first organization with their associated status',
        organizationId: getId(1),
        expectedLength: 10
      },
      {
        description: 'should return paginated transactions with custom skip and limit',
        organizationId: getId(1),
        paginationOptions: { skip: 5, limit: 2 },
        expectedLength: 2
      },
      {
        description: 'should return paginated transactions with custom skip',
        organizationId: getId(1),
        paginationOptions: { skip: 3 },
        expectedLength: 10
      },
      {
        description: 'should return paginated transactions with custom limit',
        organizationId: getId(1),
        paginationOptions: { limit: 3 },
        expectedLength: 3
      }
    ]

    test.each(testCases)('$description', async ({ paginationOptions, organizationId, expectedLength }) => {
      const result = await transactionRepository.getOrganizationTransactions(organizationId, paginationOptions)

      expect(result.transactions.length).toEqual(expectedLength)
    })
  })

  describe(TransactionRepository.prototype.createTransaction.name, () => {
    const testCases = [
      {
        description: 'should create a new transaction and return its ID',
        repositoryMethodArgs: {
          subscriptionId: getId(1),
          organizationId: getId(1),
          purchaseId: getId(1),
          stripeInvoiceId: `inv_${getId(1)}`,
          statusId: 2
        },
        expected: expect.any(Number)
      }
    ]

    it.each(testCases)('$description', async ({ repositoryMethodArgs, expected }) => {
      const id = await transactionRepository.createTransaction(repositoryMethodArgs)

      expect(id).toEqual(expected)

      const transactionsInDb = await db('transactions').select('id').where({ id }).first()
      expect(id).toEqual(transactionsInDb.id)
    })
  })
})
