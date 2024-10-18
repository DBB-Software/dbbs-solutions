import knex from 'knex'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from 'nest-knexjs'

@Injectable()
export class UserRepository {
  constructor(@InjectConnection() private readonly knexConnection: knex.Knex) {}

  async doesUserExist(id: number): Promise<boolean> {
    const result = await this.knexConnection('users')
      .count({ count: '*' })
      .where({ id })
      .first<{ count: string | number }>()

    return Boolean(result.count)
  }
}
