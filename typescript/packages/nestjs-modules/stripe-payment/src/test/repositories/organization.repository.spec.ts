import knex from 'knex'
import { OrganizationRepository } from '../../repositories/organization.repository.js'
import { createOrganizationsTable, createUsersTable } from '../factories/database.js'
import {
  dbOrganizationsList,
  dbUsersList
} from '../mocks/index.js'

describe('OrganizationRepository', () => {
  let organizationRepository: OrganizationRepository
  let db: knex.Knex

  const baseId = Date.now()
  const getId = (id: number) => id + baseId

  beforeAll(async () => {
    db = knex({
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: './test_data.db'
      }
    })

    organizationRepository = new OrganizationRepository(db)

    await createOrganizationsTable(db, dbOrganizationsList(baseId))
    await createUsersTable(db, dbUsersList(baseId))
  })

  describe('countUsers', () => {
    const testCases = [
      {
        description: 'should return the correct number of users for an organization',
        id: getId(1),
        expectedResult: 2
      },
      {
        description: 'should return 0 if no users exist for the organization',
        id: getId(2),
        expectedResult: 0
      }
    ]

    it.each(testCases)('$description', async ({ id, expectedResult }) => {
      await expect(organizationRepository.countUsers(id)).resolves.toEqual(expectedResult)
    })
  })

  describe('getQuantity', () => {
    const testCases = [
      {
        description: 'should return the correct quantity for an organization',
        id: getId(1),
        expectedResult: 10
      },
      {
        description: 'should return undefined if failed to get quantity',
        id: getId(999),
        expectedResult: undefined
      }
    ]

    it.each(testCases)('$description', async ({ id, expectedResult }) => {
      await expect(organizationRepository.getQuantity(id)).resolves.toEqual(expectedResult)
    })
  })
})
