import knex from 'knex'

import { PurchaseRepository } from '../../repositories/index.js'
import { createOrganizationsTable, createPlansTable, createPurchasesTable } from '../factories/database.js'
import { dbOrganizationsList, dbPlansList, mockCreatePurchasePayload, dbPurchasesList } from '../mocks/index.js'
import { TEST_DB_PATH } from '../../constants.js'

describe('PurchaseRepository', () => {
  let purchaseRepository: PurchaseRepository
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

    purchaseRepository = new PurchaseRepository(db)

    await createPlansTable(db, dbPlansList(baseId))
    await createOrganizationsTable(db, dbOrganizationsList(baseId))
    await createPurchasesTable(db, dbPurchasesList(baseId))
  })

  describe(`${PurchaseRepository.prototype.getOrganizationPurchases.name}`, () => {
    const testCases = [
      {
        description: 'should return all purchases for the first organization with their associated plans',
        organizationId: getId(1),
        expectedLength: 10
      },
      {
        description: 'should return paginated purchases with custom skip and limit',
        organizationId: getId(1),
        paginationOptions: { skip: 5, limit: 2 },
        expectedLength: 2
      },
      {
        description: 'should return paginated purchases with custom skip',
        organizationId: getId(1),
        paginationOptions: { skip: 3 },
        expectedLength: 10
      },
      {
        description: 'should return paginated purchases with custom limit',
        organizationId: getId(1),
        paginationOptions: { limit: 3 },
        expectedLength: 3
      }
    ]

    test.each(testCases)('$description', async ({ paginationOptions, organizationId, expectedLength }) => {
      const result = await purchaseRepository.getOrganizationPurchases(organizationId, paginationOptions)

      expect(result.purchases.length).toEqual(expectedLength)
    })
  })

  describe(PurchaseRepository.prototype.createPurchase.name, () => {
    it('should successfully create a purchase', async () => {
      const countPurchases = async (): Promise<number> => {
        const result = await db('purchases').count({ count: '*' }).first<{ count: string | number }>()
        return Number(result.count)
      }

      const countBeforeInsert = await countPurchases()
      await purchaseRepository.createPurchase(mockCreatePurchasePayload(baseId))
      const countAfterInsert = await countPurchases()

      expect(countAfterInsert).toBe(countBeforeInsert + 1)
    })
  })
})
