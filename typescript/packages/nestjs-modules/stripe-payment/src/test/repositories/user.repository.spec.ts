import knex from 'knex'
import { createUsersTable } from '../factories/database.js'
import { dbUsersList } from '../mocks/index.js'
import { UserRepository } from '../../repositories/user.repository.js'
import { TEST_DB_PATH } from '../../constants.js'

describe('UserRepository', () => {
  let userRepository: UserRepository
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

    userRepository = new UserRepository(db)

    await createUsersTable(db, dbUsersList(baseId))
  })

  describe('doesUserExist', () => {
    const testCases = [
      {
        description: 'should return true if the user exists',
        id: getId(1),
        expectedResult: true
      },
      {
        description: 'should return false if the user does not exist',
        id: getId(999),
        expectedResult: false
      }
    ]

    it.each(testCases)('$description', async ({ id, expectedResult }) => {
      await expect(userRepository.doesUserExist(id)).resolves.toEqual(expectedResult)
    })
  })
})
