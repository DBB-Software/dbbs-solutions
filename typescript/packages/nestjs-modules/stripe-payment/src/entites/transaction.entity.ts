import { TransactionStatus } from '../enums/index.js'

export class TransactionEntity {
  id: number

  subscriptionId: number

  organizationId: number

  purchaseId: number

  status: TransactionStatus

  stripeInvoiceId: string

  createdAt: Date

  updatedAt: Date
}
