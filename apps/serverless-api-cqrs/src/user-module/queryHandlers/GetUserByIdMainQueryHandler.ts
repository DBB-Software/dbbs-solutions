import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { UserMainRepository } from '../projections/user-main.repository.js'
import { GetUserByIdMain } from '../queries/index.js'

/**
 * Query handler for fetching a main user by ID.
 *
 * @class GetUserByIdMainQueryHandler
 * @implements {IQueryHandler<GetUserByIdMain>}
 */
@QueryHandler(GetUserByIdMain)
export class GetUserByIdMainQueryHandler implements IQueryHandler<GetUserByIdMain> {
  constructor(private repository: UserMainRepository) {}

  /**
   * Executes the query to get a main user by ID.
   *
   * @param {GetUserByIdMain} query - The query containing the user ID.
   * @returns {Promise<UserMain>} Promise resolving to the main user.
   */
  async execute(query: GetUserByIdMain) {
    return this.repository.getById(query.id)
  }
}
