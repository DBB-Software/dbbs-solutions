import knex from 'knex'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from 'nest-knexjs'

import { UserEntity } from '../entites/index.js'
import { UserDbRecord } from '../types/index.js'

@Injectable()
export class UserRepository {
  constructor(@InjectConnection() private readonly knexConnection: knex.Knex) {}

  static toJSON({ id, firstname, lastname, email, createdAt, updatedAt }: UserDbRecord): UserEntity {
    return {
      id,
      firstname,
      lastname,
      email,
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt)
    }
  }

  async doesUserExist(id: number): Promise<boolean> {
    const result = await this.knexConnection('users')
      .count({ count: '*' })
      .where({ id })
      .first<{ count: string | number }>()

    return Boolean(result.count)
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.knexConnection('users').where({ email }).first()
    return user ? UserRepository.toJSON(user) : null
  }

  async getOrganizationUsers(organizationId: number): Promise<UserEntity[]> {
    const users: UserDbRecord[] = await this.knexConnection('organizations_users')
      .where({ organizationId })
      .join('users', 'organizations_users.userId', 'users.id')
      .select('users.*')
    return users.map(UserRepository.toJSON)
  }
}
