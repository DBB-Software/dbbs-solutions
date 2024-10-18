import { Inject, Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { ConfigService } from '@nestjs/config'
import { STRIPE_SDK } from './constants.js'

const STRIPE_SIGNATURE_HEADER = 'stripe-signature'

@Injectable()
export class StripeService {
  constructor(
    @Inject(STRIPE_SDK) private readonly stripe: Stripe,
    private configService: ConfigService
  ) {}

  verifyWebhookSignature(payload: string, headers: { [key: string]: string }): Stripe.Event {
    if (!headers[STRIPE_SIGNATURE_HEADER]) {
      throw new Error('Stripe signature must be provided')
    }

    return this.stripe.webhooks.constructEvent(
      payload,
      headers[STRIPE_SIGNATURE_HEADER],
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET')!
    )
  }
}
