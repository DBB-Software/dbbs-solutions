import { Injectable } from '@nestjs/common'
import { NotFoundError } from '@dbbs/common'
import { OrganizationRepository } from '../repositories/organization.repository.js'
import { IPaginatedResponse, IPaginationOptions, ITransaction } from '../interfaces/index.js'
import { TransactionRepository } from '../repositories/transaction.repository.js'

@Injectable()
export class TransactionService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly transactionRepository: TransactionRepository
  ) {}

  async getOrganizationTransactions(
    organizationId: number,
    paginationOptions: IPaginationOptions = { page: 1, perPage: 10 }
  ): Promise<IPaginatedResponse<ITransaction>> {
    const { page = 1, perPage = 10 } = paginationOptions

    const organizationExists = await this.organizationRepository.organizationExists(organizationId)
    if (!organizationExists) {
      throw new NotFoundError(`Cannot get transactions for a non-existing organization with ID ${organizationId}`)
    }

    const { transactions, total } = await this.transactionRepository.getOrganizationTransactions(organizationId, {
      skip: (page - 1) * perPage,
      limit: perPage
    })

    return {
      items: transactions,
      total,
      page,
      perPage
    }
  }
}
