import { Controller } from '@nestjs/common'
import { StripePaymentService } from './stripe-payment.service.js'

@Controller('stripe-payment')
export class StripePaymentController {
  constructor(private readonly stripePaymentService: StripePaymentService) {}
}
