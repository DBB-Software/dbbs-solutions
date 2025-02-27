import { TransactionStatus } from '../enums/index.js'

export type TransactionDbRecord = {
  id: number
  subscriptionId: number
  organizationId: number
  purchaseId: number
  status: TransactionStatus
  stripeInvoiceId: string
  createdAt: string
  updatedAt: string
}

export type CreateTransactionPayload = {
  organizationId: number
  stripeInvoiceId: string
  statusId: number
  subscriptionId?: number
  purchaseId?: number
}
