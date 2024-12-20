import { UserDbRecord } from '../../types/index.js'
import { defaultDateISOString } from './date.mock.js'

export const dbUsersList = (baseId: number): UserDbRecord[] => [
  {
    id: baseId + 1,
    username: 'a',
    email: 'a@example.com',
    provider: 'provider',
    password: 'test123',
    resetPasswordToken: 'token',
    confirmationToken: 'token',
    confirmed: 0,
    blocked: 0,
    organizationId: baseId + 1,
    createdAt: defaultDateISOString,
    updatedAt: defaultDateISOString
  },
  {
    id: baseId + 2,
    username: 'a',
    email: 'a@example.com',
    provider: 'provider',
    password: 'test123',
    resetPasswordToken: 'token',
    confirmationToken: 'token',
    confirmed: 0,
    blocked: 0,
    organizationId: baseId + 1,
    createdAt: defaultDateISOString,
    updatedAt: defaultDateISOString
  },
  {
    id: baseId + 3,
    username: 'a',
    email: 'a@example.com',
    provider: 'provider',
    password: 'test123',
    resetPasswordToken: 'token',
    confirmationToken: 'token',
    confirmed: 0,
    blocked: 0,
    organizationId: undefined,
    createdAt: defaultDateISOString,
    updatedAt: defaultDateISOString
  }
]

export const dbOrganizationsUsersLinksList = (baseId: number) =>
  Array.from({ length: 15 }, (_, index) => ({
    organizationId: baseId + index + 1,
    userId: baseId + index + 1
  }))
