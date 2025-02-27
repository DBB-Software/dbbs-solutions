import { TransactionStatus } from '../enums/index.js'

export class TransactionEntity {
  id: number

  stripeInvoiceId: string

  status: TransactionStatus

  organizationId: number

  subscriptionId?: number

  purchaseId?: number

  createdAt: Date

  updatedAt: Date
}
