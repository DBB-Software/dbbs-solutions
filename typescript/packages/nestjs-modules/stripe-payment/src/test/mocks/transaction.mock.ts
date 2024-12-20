import { defaultDate, defaultDateISOString } from './date.mock.js'
import { TransactionEntity } from '../../entites/index.js'
import { TransactionStatus } from '../../enums/index.js'

export const dbTransactionsList = (baseId: number) => [
  ...Array.from({ length: 14 }, (_, index) => ({
    id: baseId + index + 1,
    subscriptionId: baseId + index + 1,
    organizationId: baseId + 1,
    purchaseId: baseId + index + 1,
    stripeInvoiceId: `inv_${baseId + index + 1}`,
    statusId: 1,
    createdAt: defaultDateISOString,
    updatedAt: defaultDateISOString
  })),
  {
    id: baseId + 15,
    subscriptionId: baseId + 15,
    organizationId: baseId + 2,
    purchaseId: baseId + 15,
    stripeInvoiceId: `inv_${baseId + 15}`,
    statusId: 1,
    createdAt: defaultDateISOString,
    updatedAt: defaultDateISOString
  }
]

export const defaultTransaction: TransactionEntity = {
  id: 1,
  subscriptionId: 1,
  organizationId: 1,
  purchaseId: 1,
  stripeInvoiceId: `inv_1`,
  status: TransactionStatus.COMPLETED,
  createdAt: defaultDate,
  updatedAt: defaultDate
}
