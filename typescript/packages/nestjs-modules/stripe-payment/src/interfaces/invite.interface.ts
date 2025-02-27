import { InviteStatus } from '../enums/invite.enum.js'

export interface IInvite {
  id: number

  email: string

  userId: number

  organizationId: number

  status: InviteStatus

  createdAt: Date

  updatedAt: Date
}

export interface ICreateInvite {
  email: string
  userId: number
  organizationId: number
}

export interface IAcceptInvite {
  inviteId: number
}

export interface ICancelInvite {
  inviteId: number
}
