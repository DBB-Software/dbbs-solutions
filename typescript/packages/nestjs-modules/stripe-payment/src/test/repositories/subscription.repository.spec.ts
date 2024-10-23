import knex from 'knex'
import { SubscriptionRepository } from '../../repositories/subscription.repository.js'
import {
  createOrganizationsTable,
  createPlansTable,
  createStatusesTable,
  createSubscriptionsTable,
  createUsersTable
} from '../factories/database.js'
import {
  dbOrganizationsList,
  dbPlansList,
  dbSubscriptionsList,
  populatedSubscriptionEntity,
  defaultSubscriptionEntity,
  secondSubscriptionEntity,
  dbUsersList,
  resubscribedDbSubscription
} from '../mocks/index.js'
import { SubscriptionStatusId } from '../../enums/index.js'

describe('SubscriptionRepository', () => {
  let subscriptionRepository: SubscriptionRepository
  let db: knex.Knex

  const baseId = Date.now()
  const getId = (id: number) => id + baseId

  beforeAll(async () => {
    db = knex({
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: './test_data.db',
      },
    })

    subscriptionRepository = new SubscriptionRepository(db)

    await createPlansTable(db, dbPlansList(baseId))
    await createStatusesTable(db)
    await createUsersTable(db, dbUsersList(baseId))
    await createOrganizationsTable(db, dbOrganizationsList(baseId))
    await createSubscriptionsTable(db, dbSubscriptionsList(baseId))
  })

  describe('Get subscriptions', () => {
    const testCases = [
      {
        description: 'should return all subscriptions with their associated plans',
        expectedLength: 10
      },
      {
        description: 'should return paginated subscriptions with custom skip and limit',
        paginationOptions: { skip: 5, limit: 2 },
        expectedLength: 2
      },
      {
        description: 'should return paginated subscriptions with custom skip',
        paginationOptions: { skip: 3 },
        expectedLength: 10
      },
      {
        description: 'should return paginated subscriptions with custom limit',
        paginationOptions: { limit: 3 },
        expectedLength: 3
      }
    ]
    test.each(testCases)('$description', async ({ paginationOptions, expectedLength }) => {
      const result = await subscriptionRepository.getSubscriptions(paginationOptions)

      expect(result.subscriptions.length).toEqual(expectedLength)
    })
  })

  describe('getSubscriptionById', () => {
    const testCases = [
      {
        description: 'should return the correct subscription by ID with populated fields',
        repositoryMethodArgs: { id: getId(1), populate: true },
        expected: populatedSubscriptionEntity(baseId),
      },
      {
        description: 'should return the correct subscription by ID without populated fields',
        repositoryMethodArgs: { id: getId(1), populate: false },
        expected: defaultSubscriptionEntity(baseId),
      },
      {
        description: 'should return null if subscription does not exist',
        repositoryMethodArgs: { id: getId(999), populate: true },
        expected: null,
      },
    ]

    it.each(testCases)('$description', async ({ repositoryMethodArgs, expected }) => {
      const { id, populate } = repositoryMethodArgs

      const result = await subscriptionRepository.getSubscriptionById(id, populate)

      expect(result).toEqual(expected)
    })
  })

  describe('updateSubscriptionStatus', () => {
    const testCases = [
      {
        description: 'should change subscription\'s status',
        repositoryMethodArgs: { id: getId(1), statusId: SubscriptionStatusId.ACTIVE },
        expectedResult: { ...defaultSubscriptionEntity(baseId), status: SubscriptionStatusId.ACTIVE }
      },
      {
        description: 'should return null if subscription does not exist',
        repositoryMethodArgs: { id: getId(999), statusId: SubscriptionStatusId.ACTIVE },
        expectedResult: null
      }
    ]

    it.each(testCases)('$description', async ({ repositoryMethodArgs, expectedResult }) => {
      const { id, statusId } = repositoryMethodArgs

      const result = await subscriptionRepository.updateSubscriptionStatus(id, statusId)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('updateSubscriptionQuantity', () => {
    const testCases = [
      {
        description: 'should update subscription\'s quantity',
        repositoryMethodArgs: { id: getId(2), quantity: 6 },
        expectedResult: { ...secondSubscriptionEntity(baseId), quantity: 6 },
      },
      {
        description: 'should return null if subscription does not exist',
        repositoryMethodArgs: { id: getId(999), quantity: 6 },
        expectedResult: null
      }
    ]

    it.each(testCases)('$description', async ({ repositoryMethodArgs, expectedResult }) => {
      const { id, quantity } = repositoryMethodArgs

      const result = await subscriptionRepository.updateSubscriptionQuantity(id, quantity)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('resubscribe', () => {
    const testCases = [
      {
        description: 'should successfully resubscribe a subscription ',
        repositoryMethodArgs: {
          id: getId(1),
          statusId: SubscriptionStatusId.CANCELED,
          stripeId: 'stripe_id',
          quantity: 3
        },
        expectedResult: 1
      },
      {
        description: 'should return null if subscription does not exist',
        repositoryMethodArgs: {
          id: getId(999),
          statusId: SubscriptionStatusId.ACTIVE,
          stripeId: 'stripe_id',
          quantity: 3
        },
        expectedResult: 0
      }
    ]

    it.each(testCases)('$description', async ({ repositoryMethodArgs, expectedResult }) => {
      const { id, statusId, stripeId, quantity } = repositoryMethodArgs

      const result = await subscriptionRepository.resubscribe(id, { statusId, stripeId, quantity })
      expect(result).toEqual(expectedResult)

      if (expectedResult) {
        const productInDb = await db('subscriptions').select('*').where({ id }).first()
        expect(productInDb).toEqual(resubscribedDbSubscription(baseId))
      }
    })
  })

  describe('Delete subscription', () => {
    const testCases = [
      {
        description: 'should delete the subscription and return the number of deleted rows',
        id: getId(1),
        expectedResult: 1,
      },
      {
        description: 'should return 0 if subscription does not exist',
        id: getId(999),
        expectedResult: 0,
      },
    ]

    it.each(testCases)('$description', async ({ id, expectedResult }) => {
      const result = await subscriptionRepository.deleteSubscription(id)

      expect(result).toBe(expectedResult)

      const subscriptionIdDb = await db('subscriptions').where({ id }).first()
      expect(subscriptionIdDb).toBeUndefined()
    })
  })
})
