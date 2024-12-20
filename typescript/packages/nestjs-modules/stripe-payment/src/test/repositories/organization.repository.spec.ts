import knex from 'knex'

import {
  createOrganizationsTable,
  createOrganizationsUsersLinksTable,
  createSubscriptionsTable,
  createUsersTable
} from '../factories/database.js'
import { OrganizationRepository } from '../../repositories/organization.repository.js'
import {
  dbOrganizationsList,
  dbOrganizationsUsersLinksList,
  dbSubscriptionsList,
  dbUsersList,
  defaultOrganizationEntity,
  mockCreatedOrganizationEntity,
  mockCreateOrganizationPayload
} from '../mocks/index.js'
import { TEST_DB_PATH } from '../../constants.js'

describe(`${OrganizationRepository.name}`, () => {
  let organizationRepository: OrganizationRepository
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

    organizationRepository = new OrganizationRepository(db)

    await createOrganizationsTable(db, dbOrganizationsList(baseId))
    await createSubscriptionsTable(db, dbSubscriptionsList(baseId))
    await createUsersTable(db, dbUsersList(baseId))
    await createOrganizationsUsersLinksTable(db, dbOrganizationsUsersLinksList(baseId))
  })

  describe(`${OrganizationRepository.prototype.getOrganizationById.name}`, () => {
    const testCases = [
      {
        description: 'should return organization by ID',
        id: getId(1),
        expected: defaultOrganizationEntity(baseId)
      },
      {
        description: 'should return null if organization does not exist',
        id: getId(999),
        expected: null
      }
    ]

    it.each(testCases)('$description', async ({ id, expected }) => {
      const result = await organizationRepository.getOrganizationById(id)

      expect(result).toEqual(expected)
    })
  })

  describe(`${OrganizationRepository.prototype.getOrganizationByStripeCustomerId.name}`, () => {
    const testCases = [
      {
        description: 'should return organization by Stripe customer ID',
        stripeCustomerId: `${getId(1)}`,
        expected: defaultOrganizationEntity(baseId)
      },
      {
        description: 'should return null if organization does not exist',
        stripeCustomerId: `${getId(999)}`,
        expected: null
      }
    ]

    it.each(testCases)('$description', async ({ stripeCustomerId, expected }) => {
      const result = await organizationRepository.getOrganizationByStripeCustomerId(stripeCustomerId)

      expect(result).toEqual(expected)
    })
  })

  describe(`${OrganizationRepository.prototype.organizationExists.name}`, () => {
    const testCases = [
      {
        description: 'should return true for an existing organization',
        id: getId(1),
        expectedResult: true
      },
      {
        description: 'should return false if an organization does not exist',
        id: getId(999),
        expectedResult: false
      }
    ]

    it.each(testCases)('$description', async ({ id, expectedResult }) => {
      const result = await organizationRepository.organizationExists(id)

      expect(result).toEqual(expectedResult)
    })
  })

  describe(`${OrganizationRepository.prototype.organizationExistsByName.name}`, () => {
    const testCases = [
      {
        description: 'should return true if an organization with the provided name exists',
        name: `Organization ${getId(1)}`,
        expectedResult: true
      },
      {
        description: 'should return false if an organization does not exist',
        name: `Organization ${getId(999)}`,
        expectedResult: false
      }
    ]

    it.each(testCases)('$description', async ({ name, expectedResult }) => {
      const result = await organizationRepository.organizationExistsByName(name)

      expect(result).toEqual(expectedResult)
    })
  })

  describe(`${OrganizationRepository.prototype.countUsers.name}`, () => {
    const testCases = [
      {
        description: 'should return the correct number of users for an organization',
        id: getId(1),
        expectedResult: 1
      },
      {
        description: 'should return 0 if no users exist for the organization',
        id: getId(99),
        expectedResult: 0
      }
    ]

    it.each(testCases)('$description', async ({ id, expectedResult }) => {
      await expect(organizationRepository.countUsers(id)).resolves.toEqual(expectedResult)
    })
  })

  describe(`${OrganizationRepository.prototype.getQuantity.name}`, () => {
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

  describe(`${OrganizationRepository.prototype.createOrganization.name}`, () => {
    const testCases = [
      {
        description: 'should create a new organization and return it',
        serviceMethodArgs: mockCreateOrganizationPayload(getId(1)),
        expected: { ...mockCreatedOrganizationEntity(getId(1)), id: expect.any(Number) }
      }
    ]

    it.each(testCases)('$description', async ({ serviceMethodArgs, expected }) => {
      const result = await organizationRepository.createOrganization(serviceMethodArgs)
      expect(result).toEqual(expected)

      const organizationInDb = await db('organizations').select('id').where({ id: result.id }).first()
      expect(organizationInDb.id).toEqual(result.id)
    })
  })

  describe(`${OrganizationRepository.prototype.getAll.name}`, () => {
    test.each([
      {
        description: 'should return all organizations with their associated plans',
        expectedLength: 10
      },
      {
        description: 'should return paginated organizations with custom skip and limit',
        paginationOptions: { skip: 5, limit: 2 },
        expectedLength: 2
      },
      {
        description: 'should return paginated organizations with custom skip',
        paginationOptions: { skip: 3 },
        expectedLength: 10
      },
      {
        description: 'should return paginated organizations with custom limit',
        paginationOptions: { limit: 3 },
        expectedLength: 3
      }
    ])('$description', async ({ paginationOptions, expectedLength }) => {
      const result = await organizationRepository.getAll(paginationOptions)

      expect(result.organizations.length).toEqual(expectedLength)
    })
  })

  describe(`${OrganizationRepository.prototype.getOrganizationById.name}`, () => {
    it.each([
      {
        description: 'should return the correct organization by ID',
        repositoryMethodArgs: { id: getId(1) },
        expected: defaultOrganizationEntity(baseId)
      },
      {
        description: 'should return null if organization does not exist',
        repositoryMethodArgs: { id: getId(999) },
        expected: null
      }
    ])('$description', async ({ repositoryMethodArgs, expected }) => {
      const { id } = repositoryMethodArgs

      const result = await organizationRepository.getOrganizationById(id)

      expect(result).toEqual(expected)
    })
  })

  describe(OrganizationRepository.prototype.updateOrganization.name, () => {
    it.each([
      {
        description: 'should update an existing organization and return it',
        repositoryMethodArgs: { id: getId(1), name: 'Updated Organization 1' },
        expected: { ...defaultOrganizationEntity(baseId), name: 'Updated Organization 1' }
      },
      {
        description: 'should update an existing organization with quantity and return it',
        repositoryMethodArgs: { id: getId(2), name: 'Updated Organization 2', quantity: 101 },
        expected: { ...defaultOrganizationEntity(getId(1)), name: 'Updated Organization 2', quantity: 101 }
      },
      {
        description: 'should return null if organization does not exist',
        repositoryMethodArgs: { id: getId(999), name: 'Non-Existent Organization' },
        expected: null
      }
    ])('$description', async ({ repositoryMethodArgs, expected }) => {
      const { id, name, quantity } = repositoryMethodArgs
      const result = await organizationRepository.updateOrganization({ id, name, quantity })

      expect(result).toEqual(expected)

      if (expected) {
        const organizationInDb = await db('organizations').select('id').where({ id }).first()
        expect(organizationInDb.id).toEqual(result?.id)
      }
    })
  })

  describe(OrganizationRepository.prototype.deleteOrganization.name, () => {
    it.each([
      {
        name: 'should delete the organization and return the number of deleted rows',
        id: getId(1),
        expectedResult: 1
      },
      {
        name: 'should return 0 if organization does not exist',
        id: getId(999),
        expectedResult: 0
      }
    ])('$name', async ({ id, expectedResult }) => {
      await expect(organizationRepository.deleteOrganization(id)).resolves.toBe(expectedResult)
    })
  })

  describe(OrganizationRepository.prototype.getUserOrganizations.name, () => {
    it.each([
      {
        name: 'all organization for an existing user',
        userId: getId(3),
        expectedResult: [defaultOrganizationEntity(getId(2))]
      },
      {
        name: 'should return an empty array if the user does not belong to any organization',
        userId: getId(0),
        expectedResult: []
      }
    ])('$name', async ({ userId, expectedResult }) => {
      const result = await organizationRepository.getUserOrganizations(userId)

      expect(result).toEqual(expectedResult)
    })
  })
})
