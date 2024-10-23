import knex from 'knex'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from 'nest-knexjs'

@Injectable()
export class OrganizationRepository {
  constructor(@InjectConnection() private readonly knexConnection: knex.Knex) {}

  async countUsers(id: number): Promise<number> {
    const result = await this.knexConnection('users')
      .where('organizationId', id)
      .count({ count: '*' })
      .first<{ count: number | string }>()

    return Number(result.count)
  }

  async getQuantity(id: number): Promise<number | undefined> {
    const result = await this.knexConnection('organizations').select('quantity').where({ id }).first()
    return result?.quantity
  }
}
