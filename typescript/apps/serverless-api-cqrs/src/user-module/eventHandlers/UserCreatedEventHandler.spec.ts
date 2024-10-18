import { jest } from '@jest/globals'
import { UserCreatedEventHandler } from './UserCreatedEventHandler.js'
import { UserMainRepository } from '../projections/user-main.repository.js'
import { Knex } from 'nestjs-knex'
import { UserCreated } from '../events/index.js'

describe('UserCreatedEventHandler', () => {
  describe('handle', () => {
    let repository: UserMainRepository
    let handler: UserCreatedEventHandler

    beforeEach(() => {
      repository = new UserMainRepository({} as Knex)
      repository.save = jest.fn() as jest.Mocked<typeof repository.save>
      handler = new UserCreatedEventHandler(repository)
    })

    const testCases = [
      {
        description: 'should call repository with specific event',
        payload: new UserCreated({ id: '1', name: 'John Doe' }),
        expected: { id: '1', name: 'John Doe' }
      }
    ]
    test.each(testCases)('$description', async ({ payload, expected }) => {
      await handler.handle(payload)

      expect(repository.save).toHaveBeenCalledWith(expected)
    })
  })
})
