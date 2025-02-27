import { StripeInvoice, StripePaymentIntent, StripeResponse } from '@dbbs/nestjs-module-stripe'
import { defaultDate, defaultDateISOString } from './date.mock.js'
import { TransactionStatus } from '../../enums/index.js'
import { ITransaction } from '../../interfaces/index.js'

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

export const defaultTransactionEntity = (baseId: number) => ({
  id: baseId + 1,
  subscriptionId: baseId + 1,
  organizationId: baseId + 1,
  purchaseId: baseId + 1,
  stripeInvoiceId: `inv_${baseId + 1}`,
  status: TransactionStatus.PENDING,
  createdAt: defaultDate,
  updatedAt: defaultDate
})

export const defaultTransaction: ITransaction = {
  id: 1,
  subscriptionId: 1,
  organizationId: 1,
  purchaseId: 1,
  stripeInvoiceId: `inv_1`,
  status: TransactionStatus.COMPLETED,
  createdAt: defaultDate,
  updatedAt: defaultDate
}

export const defaultStripeInvoice = {
  id: 'inv_test'
} as StripeResponse<StripeInvoice>

export const defaultStripePaymentIntent = {
  id: 'pi_test'
} as StripeResponse<StripePaymentIntent>
