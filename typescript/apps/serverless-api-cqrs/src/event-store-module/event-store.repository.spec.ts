import knex from 'knex'
import { Logger } from '@dbbs/nestjs-module-logger'
import { EventStoreRepository } from './event-store.repository.js'
import { Event } from '../types/common.js'

describe('EventStoreRepository', () => {
  const logger = new Logger({})
  let db: knex.Knex

  beforeAll(() => {
    db = knex({
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: './data.db'
      }
    })
  })

  afterAll(async () => {
    await db.schema.dropTable('events')
    await db.destroy()
  })

  describe('getEventsByAggregateId', () => {
    const EVENTS_MOCK = [
      { aggregateId: '1', eventName: 'UserCreated', eventBody: { name: 'John Doe' } },
      { aggregateId: '2', eventName: 'UserCreated', eventBody: { name: 'John Doe' } },
      { aggregateId: '2', eventName: 'UserUpdated', eventBody: { name: 'John Smith' } }
    ]

    let repo: EventStoreRepository

    beforeAll(async () => {
      repo = new EventStoreRepository(db, logger)
      await repo.onModuleInit()
      await db.table('events').insert(EVENTS_MOCK)
    })

    const testCases = [
      {
        description: 'should return an event for the aggregate with ID = 1',
        id: '1',
        expected: [EVENTS_MOCK[0]]
      },
      {
        description: 'should return events for the aggregate with ID = 2',
        id: '2',
        expected: [EVENTS_MOCK[1], EVENTS_MOCK[2]]
      },
      {
        description: 'should return empty array for the aggregate with ID = 3',
        id: '3',
        expected: []
      },
      {
        description: 'should return empty array for the aggregate with no ID',
        id: '',
        expected: []
      }
    ]
    test.each(testCases)('$description', async ({ id, expected }) => {
      const result = await repo.getEventsByAggregateId(id)
      expect(result.length).toEqual(expected.length)
      expect(result.map((r) => r.eventName).sort()).toEqual(expected.map((e) => e.eventName).sort())
    })
  })

  describe('saveEvents', () => {
    const EVENTS_MOCK: Event[] = [
      { constructor: { name: 'UserCreated' }, toJson: () => ({ name: 'John Doe' }) },
      { constructor: { name: 'UserUpdated' }, toJson: () => ({ name: 'John Smith' }) }
    ]

    let repo: EventStoreRepository

    beforeAll(async () => {
      repo = new EventStoreRepository(db, logger)
      await repo.onModuleInit()
    })

    const testCases = [
      {
        description: 'should save new events',
        id: '4',
        events: EVENTS_MOCK,
        expected: true,
        saved: [
          { aggregateId: '4', eventName: 'UserCreated', eventBody: { name: 'John Doe' } },
          { aggregateId: '4', eventName: 'UserUpdated', eventBody: { name: 'John Smith' } }
        ]
      },
      {
        description: 'should not save events with no ID',
        id: '',
        events: EVENTS_MOCK,
        expected: false,
        saved: []
      }
    ]
    test.each(testCases)('$description', async ({ id, events, expected, saved }) => {
      const result = await repo.saveEvents(id, events)
      expect(result).toEqual(expected)

      const savedData = await db.table('events').where({ aggregateId: id })
      expect(savedData.map((r) => r.eventName).sort()).toEqual(saved.map((e) => e.eventName).sort())
    })
  })
})
