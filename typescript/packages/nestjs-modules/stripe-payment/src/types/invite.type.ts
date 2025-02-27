import { InviteStatus } from '../enums/invite.enum.js'

export type InviteDbRecord = {
  id: number
  email: string
  userId: number
  organizationId: number
  statusId: number
  createdAt: string
  updatedAt: string
}

export type CreateInvitePayload = {
  email: string
  userId: number
  status: InviteStatus
  organizationId: number
}

export type UpdateInviteStatusPayload = {
  inviteId: number
  status: InviteStatus
}
