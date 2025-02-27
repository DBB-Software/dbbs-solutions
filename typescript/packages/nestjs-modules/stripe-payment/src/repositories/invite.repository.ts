import knex from 'knex'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from 'nest-knexjs'

import { InviteEntity } from '../entites/invite.entity.js'
import { CreateInvitePayload, InviteDbRecord, UpdateInviteStatusPayload } from '../types/invite.type.js'

@Injectable()
export class InviteRepository {
  constructor(@InjectConnection() private readonly knexConnection: knex.Knex) {}

  public static toJSON({
    id,
    email,
    userId,
    organizationId,
    statusId,
    createdAt,
    updatedAt
  }: InviteDbRecord): InviteEntity {
    return {
      id,
      email,
      userId,
      organizationId,
      status: statusId,
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt)
    }
  }

  async createInvite({ status, email, userId, organizationId }: CreateInvitePayload): Promise<InviteEntity> {
    const [createdInvite] = await this.knexConnection('invites')
      .insert({ email, userId, organizationId, statusId: status })
      .returning('*')

    return InviteRepository.toJSON(createdInvite)
  }

  async updateInviteStatus({ inviteId, status }: UpdateInviteStatusPayload): Promise<InviteEntity | null> {
    const [updatedInvite] = await this.knexConnection('invites')
      .where({ id: inviteId })
      .update({ statusId: status })
      .returning('*')

    return updatedInvite ? InviteRepository.toJSON(updatedInvite) : null
  }

  async getInviteById(id: number): Promise<InviteEntity | null> {
    const [invite] = await this.knexConnection('invites').select('*').where({ id }).returning('*')
    return invite ? InviteRepository.toJSON(invite) : null
  }
}
