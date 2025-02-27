import knex from 'knex'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from 'nest-knexjs'
import { CreateTransactionPayload, PaginationOptions, TransactionDbRecord } from '../types/index.js'
import { TransactionEntity } from '../entites/index.js'

@Injectable()
export class TransactionRepository {
  constructor(@InjectConnection() private readonly knexConnection: knex.Knex) {}

  static toJSON({
    id,
    subscriptionId,
    organizationId,
    purchaseId,
    status,
    stripeInvoiceId,
    createdAt,
    updatedAt
  }: TransactionDbRecord): TransactionEntity {
    return {
      id,
      subscriptionId,
      organizationId,
      purchaseId,
      status,
      stripeInvoiceId,
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt)
    }
  }

  async getTransactionByStripeInvoiceId(stripeInvoiceId: string): Promise<TransactionEntity | null> {
    const transaction = await this.knexConnection('transactions')
      .select(
        'transactions.id',
        'transactions.subscriptionId',
        'transactions.organizationId',
        'transactions.purchaseId',
        'transactions.stripeInvoiceId',
        'transaction_statuses.status',
        'transactions.createdAt',
        'transactions.updatedAt'
      )
      .join('transaction_statuses', 'transactions.statusId', '=', 'transaction_statuses.id')
      .where({ stripeInvoiceId })
      .first()

    return transaction ? TransactionRepository.toJSON(transaction) : null
  }

  async getOrganizationTransactions(
    organizationId: number,
    paginationOptions: PaginationOptions = { skip: 0, limit: 10 }
  ): Promise<{ transactions: TransactionEntity[]; total: number }> {
    const { skip = 0, limit = 10 } = paginationOptions

    const baseQuery = this.knexConnection('transactions')
      .select(
        'transactions.id',
        'transactions.subscriptionId',
        'transactions.organizationId',
        'transactions.purchaseId',
        'transactions.stripeInvoiceId',
        'transaction_statuses.status',
        'transactions.createdAt',
        'transactions.updatedAt'
      )
      .join('transaction_statuses', 'transactions.statusId', '=', 'transaction_statuses.id')
      .where({ organizationId })

    const transactions = await baseQuery.offset(skip).limit(limit)
    const totalQueryResult = await baseQuery.count('transactions.id as total').first()
    const total = Number(totalQueryResult?.total) || 0

    return {
      transactions: transactions.map((transaction) => TransactionRepository.toJSON(transaction)),
      total
    }
  }

  async createTransaction(payload: CreateTransactionPayload): Promise<number> {
    const [{ id }] = await this.knexConnection('transactions').insert(payload).returning('id')

    return Number(id)
  }
}
