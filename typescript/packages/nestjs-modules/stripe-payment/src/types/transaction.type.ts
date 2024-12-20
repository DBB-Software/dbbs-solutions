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
  subscriptionId: number
  organizationId: number
  purchaseId: number
  statusId: number
  stripeInvoiceId: string
}
