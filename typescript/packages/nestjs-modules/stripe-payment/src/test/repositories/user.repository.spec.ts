import knex from 'knex'

import { UserRepository } from '../../repositories/index.js'
import { createOrganizationsUsersLinksTable, createUsersTable } from '../factories/database.js'
import { dbOrganizationsUsersLinksList, dbUsersList, defaultUserEntity } from '../mocks/index.js'
import { TEST_DB_PATH } from '../../constants.js'
import { UserEntity } from '../../entites/index.js'

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
    await createOrganizationsUsersLinksTable(db, dbOrganizationsUsersLinksList(baseId))
  })

  describe('doesUserExist', () => {
    it.each([
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
    ])('$description', async ({ id, expectedResult }) => {
      await expect(userRepository.doesUserExist(id)).resolves.toEqual(expectedResult)
    })
  })

  describe('findByEmail', () => {
    it.each<{
      name: string
      email: string
      expectedResult: UserEntity | null
    }>([
      {
        name: 'should return found user',
        email: `test${getId(1)}@example.com`,
        expectedResult: defaultUserEntity(getId(1))
      },
      {
        name: 'should return nul whe user not found',
        email: 'notfound@mail.com',
        expectedResult: null
      }
    ])('$name', async ({ email, expectedResult }) => {
      const result = await userRepository.findByEmail(email)

      expect(result).toEqual(expectedResult)
    })
  })

  describe(UserRepository.prototype.getOrganizationUsers.name, () => {
    it.each<{
      name: string
      params: number
      expectedResult: UserEntity[]
    }>([
      {
        name: 'should return all users for organization',
        params: getId(1),
        expectedResult: [defaultUserEntity(getId(1))]
      },
      {
        name: 'should empty array for non-exist organization',
        params: getId(999),
        expectedResult: []
      }
    ])('$name', async ({ params, expectedResult }) => {
      const result = await userRepository.getOrganizationUsers(params)

      expect(result).toEqual(expectedResult)
    })
  })
})
