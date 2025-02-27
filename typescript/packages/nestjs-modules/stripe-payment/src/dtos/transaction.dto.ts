import { TransactionStatus } from '../enums/index.js'

export class TransactionDto {
  id: number

  organizationId: number

  stripeInvoiceId: string

  status: TransactionStatus

  subscriptionId?: number

  purchaseId?: number

  createdAt: Date

  updatedAt: Date
}
