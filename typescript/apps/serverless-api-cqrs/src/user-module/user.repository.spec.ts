import { jest } from '@jest/globals'
import { EventStoreRepository } from '../event-store-module/event-store.repository.js'
import { Knex } from 'nestjs-knex'
import { Logger } from '@dbbs/nestjs-module-logger'
import { UserRepository } from './user.repository.js'
import { UserAggregate } from './user.aggregate.js'

describe('UserRepository', () => {
  describe('buildUserAggregate', () => {
    let repository: UserRepository
    let eventStore: EventStoreRepository

    beforeEach(() => {
      eventStore = new EventStoreRepository({} as Knex, {} as Logger)
      eventStore.getEventsByAggregateId = jest
        .fn()
        .mockImplementation(() => [{ eventName: 'UserCreated', eventBody: { name: 'John Doe' } }]) as jest.Mocked<
        typeof eventStore.getEventsByAggregateId
      >
      repository = new UserRepository(eventStore)
    })

    const testCases = [
      {
        description: 'should build an aggregate using events from Event Store',
        id: '1',
        expected: '{"id":"1","name":"John Doe"}'
      },
      {
        description: 'should return an empty aggregate is thee is no ID specified',
        id: '',
        expected: '{}'
      }
    ]
    test.each(testCases)('$description', async ({ id, expected }) => {
      const result = await repository.buildUserAggregate(id)
      expect(JSON.stringify(result)).toEqual(expected)
    })

    test('should return an aggregate from cache', async () => {
      await repository.buildUserAggregate('2')
      await repository.buildUserAggregate('2')

      expect(eventStore.getEventsByAggregateId).toHaveBeenCalledTimes(1)
    })
  })

  describe('save', () => {
    const eventStore = new EventStoreRepository({} as Knex, {} as Logger)
    eventStore.saveEvents = jest.fn() as jest.Mocked<typeof eventStore.saveEvents>
    const repository = new UserRepository(eventStore)

    const testCases = [
      {
        description: 'should build an aggregate using events from Event Store',
        getAggregate: () => {
          const aggregate = new UserAggregate()
          aggregate.create({ name: 'John Doe' })
          return aggregate
        },
        expected: true
      },
      {
        description: 'should return an empty aggregate is thee is no ID specified',
        getAggregate: () => {
          return new UserAggregate()
        },
        expectedError: 'Aggregate is empty'
      }
    ]
    test.each(testCases)('$description', async ({ getAggregate, expected, expectedError }) => {
      try {
        const result = await repository.save(getAggregate(), [])
        expect(result).toEqual(expected)

        if (expectedError) {
          expect(true).toBeFalsy()
        }
      } catch (err) {
        if (!expectedError) {
          throw err
        }
        expect((err as Error).message).toEqual(expectedError)
      }
    })
  })
})
