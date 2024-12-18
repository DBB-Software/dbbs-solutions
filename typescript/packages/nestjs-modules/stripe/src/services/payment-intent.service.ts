import Stripe from 'stripe'
import { Inject, Injectable } from '@nestjs/common'
import { STRIPE_SDK } from '../constants.js'
import { IGetPaymentIntent } from '../interfaces/index.js'

@Injectable()
export class PaymentIntentService {
  constructor(@Inject(STRIPE_SDK) private readonly stripe: Stripe) {}

  getPaymentIntentById(params: IGetPaymentIntent) {
    const { id } = params

    return this.stripe.paymentIntents.retrieve(id)
  }
}
