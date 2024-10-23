import { jest } from '@jest/globals'
import { UserAggregate } from './user.aggregate.js'

describe('UserAggregate', () => {
  describe('toJson', () => {
    const testCases = [
      {
        description: 'should return a js Object',
        getAggregate: () => {
          const aggregate = new UserAggregate()
          aggregate.create({ id: '1', name: 'John Doe' })
          return aggregate
        },
        expected: { id: '1', name: 'John Doe' }
      },
      {
        description: 'should return a js Object',
        getAggregate: () => new UserAggregate(),
        expectedError: 'Aggregate is empty'
      }
    ]
    test.each(testCases)('$description', ({ getAggregate, expected, expectedError }) => {
      try {
        const result = getAggregate().toJson()
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

  describe('create', () => {
    let aggregate: UserAggregate

    beforeEach(() => {
      aggregate = new UserAggregate()
      aggregate.apply = jest.fn()
    })

    const testCases = [
      {
        description: 'should create new aggregate with new ID',
        payload: { name: 'John Doe' },
        expected: { name: 'John Doe' }
      },
      {
        description: 'should build an aggregate using existing event',
        payload: { id: '1', name: 'John Doe' },
        expected: { id: '1', name: 'John Doe' }
      }
    ]
    test.each(testCases)('$description', ({ payload, expected }) => {
      const result = aggregate.create(payload)

      expect(aggregate.apply).toHaveBeenCalledTimes(1)
      expect(result[0].toJson().name).toEqual(expected.name)
      if (expected.id) {
        expect(result[0].toJson().id).toEqual(expected.id)
      }
    })
  })
})
