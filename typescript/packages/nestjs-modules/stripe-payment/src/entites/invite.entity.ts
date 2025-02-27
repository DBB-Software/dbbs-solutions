import { InviteStatus } from '../enums/invite.enum.js'

export class InviteEntity {
  id: number

  email: string

  userId: number

  organizationId: number

  status: InviteStatus

  createdAt: Date

  updatedAt: Date
}
