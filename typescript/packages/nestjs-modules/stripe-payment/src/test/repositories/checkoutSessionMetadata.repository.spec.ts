import knex from 'knex'
import { CheckoutSessionMetadataRepository } from '../../repositories/checkoutSessionMetadata.repository.js'
import { createCheckoutSessionMetadataTable } from '../factories/database.js'
import {
  createCheckoutSessionMetadataPayload,
  dbCheckoutSessionMetadataList,
  defaultCheckoutSessionMetadataEntity
} from '../mocks/index.js'
import { TEST_DB_PATH } from '../../constants.js'

describe('CheckoutSessionMetadataRepository', () => {
  let checkoutSessionMetadataRepository: CheckoutSessionMetadataRepository
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

    checkoutSessionMetadataRepository = new CheckoutSessionMetadataRepository(db)

    await createCheckoutSessionMetadataTable(db, dbCheckoutSessionMetadataList(baseId))
  })

  describe(CheckoutSessionMetadataRepository.prototype.saveMetadata.name, () => {
    const testCases = [
      {
        description: 'should save the metadata and return the ID of the inserted record',
        repositoryMethodArgs: createCheckoutSessionMetadataPayload(baseId)
      }
    ]

    it.each(testCases)('$description', async ({ repositoryMethodArgs }) => {
      const countMetadata = async (): Promise<number> => {
        const result = await db('checkout_sessions_metadata').count({ count: '*' }).first<{ count: string | number }>()
        return Number(result.count)
      }

      const countBeforeInsert = await countMetadata()
      await checkoutSessionMetadataRepository.saveMetadata(repositoryMethodArgs)
      const countAfterInsert = await countMetadata()

      expect(countAfterInsert).toBe(countBeforeInsert + 1)
    })
  })

  describe(CheckoutSessionMetadataRepository.prototype.getMetadataByCheckoutSessionStripeId.name, () => {
    const testCases = [
      {
        description: 'should return metadata by ID',
        stripeId: `cs_${getId(1)}`,
        expected: defaultCheckoutSessionMetadataEntity(baseId)
      },
      {
        description: 'should return null if metadata does not exist',
        stripeId: `cs_${getId(999)}`,
        expected: null
      }
    ]

    it.each(testCases)('$description', async ({ stripeId, expected }) => {
      const result = await checkoutSessionMetadataRepository.getMetadataByCheckoutSessionStripeId(stripeId)

      expect(result).toEqual(expected)
    })
  })
})
