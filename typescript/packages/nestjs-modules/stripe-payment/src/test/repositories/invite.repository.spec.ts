import knex from 'knex'

import { InviteRepository } from '../../repositories/index.js'
import { InviteEntity } from '../../entites/invite.entity.js'
import { InviteStatus } from '../../enums/invite.enum.js'
import { defaultInviteEntity, createInvitePayload, dbInvitesList, updateInvitePayload } from '../mocks/invite.mock.js'
import { TEST_DB_PATH } from '../../constants.js'
import { createInviteTable } from '../factories/database.js'

describe(InviteRepository.name, () => {
  let repository: InviteRepository
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

    repository = new InviteRepository(db)

    await createInviteTable(db, dbInvitesList(baseId))
  })

  describe(InviteRepository.prototype.createInvite.name, () => {
    it.each<{
      name: string
      params: Parameters<typeof InviteRepository.prototype.createInvite>
      expectedResult?: InviteEntity
    }>([
      {
        name: 'should create a new invite',
        params: [createInvitePayload(baseId)],
        expectedResult: {
          ...defaultInviteEntity(baseId),
          id: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      }
    ])('$name', async ({ params, expectedResult }) => {
      const result = await repository.createInvite(...params)
      expect(result).toEqual(expectedResult)

      const inviteInDb = await db('invites').select('id').where({ id: result.id }).first()
      expect(inviteInDb.id).toEqual(result.id)
    })
  })

  describe(InviteRepository.prototype.updateInviteStatus.name, () => {
    it.each<{
      name: string
      params: Parameters<typeof InviteRepository.prototype.updateInviteStatus>
      expectedResult?: InviteEntity | null
    }>([
      {
        name: 'should update an existing invite',
        params: [updateInvitePayload(getId(1), InviteStatus.Accepted)],
        expectedResult: {
          ...defaultInviteEntity(getId(1)),
          status: InviteStatus.Accepted
        }
      },
      {
        name: 'should return null when invite not found',
        params: [updateInvitePayload(getId(23), InviteStatus.Accepted)],
        expectedResult: null
      }
    ])('$name', async ({ params, expectedResult }) => {
      const result = await repository.updateInviteStatus(...params)
      expect(result).toEqual(expectedResult)
    })
  })

  describe(InviteRepository.prototype.getInviteById.name, () => {
    it.each<{
      name: string
      params: number
      expectedResult: InviteEntity | null
    }>([
      {
        name: 'should find invite by inviteId',
        params: getId(1),
        expectedResult: { ...defaultInviteEntity(getId(1)), status: InviteStatus.Accepted }
      },
      {
        name: 'should return null when invite not found',
        params: getId(999),
        expectedResult: null
      }
    ])('$name', async ({ params, expectedResult }) => {
      const result = await repository.getInviteById(params)

      expect(result).toEqual(expectedResult)
    })
  })
})
