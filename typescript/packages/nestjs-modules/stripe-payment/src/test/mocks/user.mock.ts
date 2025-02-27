import { UserDbRecord } from '../../types/index.js'
import { defaultDate, defaultDateISOString } from './date.mock.js'
import { UserEntity } from '../../entites/index.js'

export const dbUsersList = (baseId: number): UserDbRecord[] =>
  Array.from({ length: 15 }, (_, index) => ({
    id: baseId + 1 + index,
    firstname: `Test ${baseId + 1 + index}`,
    lastname: `Testov ${baseId + 1 + index}`,
    email: `test${baseId + 1 + index}@example.com`,
    createdAt: defaultDateISOString,
    updatedAt: defaultDateISOString
  }))

export const dbOrganizationsUsersLinksList = (baseId: number) =>
  Array.from({ length: 15 }, (_, index) => ({
    organizationId: baseId + index + 1,
    userId: baseId + index + 1
  }))

export const defaultUserEntity = (baseId: number): UserEntity => ({
  id: baseId,
  firstname: `Test ${baseId}`,
  lastname: `Testov ${baseId}`,
  email: `test${baseId}@example.com`,
  createdAt: defaultDate,
  updatedAt: defaultDate
})
