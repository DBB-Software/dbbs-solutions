import { Injectable } from '@nestjs/common'
import { InjectKnex, Knex } from 'nestjs-knex'
import { User } from '../../types/user.js'

/**
 * Repository for managing main user data.
 *
 * @class UserMainRepository
 */
@Injectable()
export class UserMainRepository {
  private tableName: string = 'users'

  // @ts-ignore
  constructor(@InjectKnex() private readonly knex: Knex) {}

  /**
   * Initializes the module by creating the users table if it doesn't exist.
   */
  async onModuleInit() {
    if (!(await this.knex.schema.hasTable(this.tableName))) {
      await this.knex.schema.createTable(this.tableName, (table) => {
        table.string('id').primary()
        table.string('name')
      })
    }
  }

  /**
   * Saves a user record to the database.
   *
   * @param {User} record - The user record to save.
   * @returns {Promise<boolean>} Promise resolving to a boolean indicating success.
   */
  async save(record: User): Promise<boolean> {
    await this.knex.table(this.tableName).insert([record])

    return true
  }

  /**
   * Retrieves all users from the database.
   *
   * @returns {Promise<User[]>} Promise resolving to an array of users.
   */
  async getAll(): Promise<User[]> {
    return this.knex.table(this.tableName)
  }

  /**
   * Retrieves a user by ID from the database.
   *
   * @param {string} id - The user ID.
   * @returns {Promise<User>} Promise resolving to the user.
   * @throws {Error} If the user is not found.
   */
  async getById(id: string): Promise<User> {
    const user = await this.knex.table(this.tableName).where({ id }).first()

    if (!user) {
      throw new Error(`User with id: ${id} not found`)
    }

    return user
  }
}
