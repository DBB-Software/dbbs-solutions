import Stripe from 'stripe'
import { Inject, Injectable } from '@nestjs/common'
import { STRIPE_SDK } from '../constants.js'
import { IGetInvoiceByIdParams } from '../interfaces/index.js'

@Injectable()
export class InvoiceService {
  constructor(@Inject(STRIPE_SDK) private readonly stripe: Stripe) {}

  getInvoiceById(params: IGetInvoiceByIdParams) {
    const { id } = params

    return this.stripe.invoices.retrieve(id)
  }
}
