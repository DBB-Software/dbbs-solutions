import { jest } from '@jest/globals'
import { GetUsersMainQueryHandler } from './GetUsersMainQueryHandler.js'
import { UserMainRepository } from '../projections/user-main.repository.js'
import { Knex } from 'nestjs-knex'

describe('GetUsersMainQueryHandler', () => {
  describe('execute', () => {
    let repository: UserMainRepository
    let handler: GetUsersMainQueryHandler

    beforeEach(() => {
      repository = new UserMainRepository({} as Knex)
      repository.getAll = jest.fn() as jest.Mocked<typeof repository.getAll>
      handler = new GetUsersMainQueryHandler(repository)
    })

    const testCases = [
      {
        description: 'should call repository'
      }
    ]
    test.each(testCases)('$description', async () => {
      await handler.execute()

      expect(repository.getAll).toHaveBeenCalledTimes(1)
    })
  })
})
