import { defaultDate, defaultDateISOString } from './date.mock.js'
import { InviteEntity } from '../../entites/invite.entity.js'
import { InviteStatus } from '../../enums/invite.enum.js'
import { CreateInvitePayload, UpdateInviteStatusPayload } from '../../types/invite.type.js'

export const dbInvitesList = (baseId: number) =>
  Array.from({ length: 15 }, (_, index) => ({
    id: baseId + index + 1,
    organizationId: baseId + index + 1,
    userId: baseId + index + 1,
    email: `${baseId + index + 1}mail_@mail.com`,
    statusId: 1,
    createdAt: defaultDateISOString,
    updatedAt: defaultDateISOString
  }))

export const defaultInviteEntity = (baseId: number): InviteEntity => ({
  id: baseId,
  organizationId: baseId,
  userId: baseId,
  email: `${baseId}mail_@mail.com`,
  status: InviteStatus.Pending,
  createdAt: defaultDate,
  updatedAt: defaultDate
})

export const createInvitePayload = (baseId: number): CreateInvitePayload => ({
  organizationId: baseId,
  userId: baseId,
  status: InviteStatus.Pending,
  email: `${baseId}mail_@mail.com`
})

export const updateInvitePayload = (baseId: number, status: InviteStatus): UpdateInviteStatusPayload => ({
  inviteId: baseId,
  status
})
