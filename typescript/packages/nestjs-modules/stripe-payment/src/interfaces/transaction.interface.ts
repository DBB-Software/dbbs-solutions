import { TransactionStatus } from '../enums/index.js'

export interface ITransaction {
  id: number
  organizationId: number
  stripeInvoiceId: string
  status: TransactionStatus
  subscriptionId?: number
  purchaseId?: number
  createdAt: Date
  updatedAt: Date
}
