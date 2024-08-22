import { Module } from '@nestjs/common'
import { StripeModule } from '@dbbs/nestjs-module-stripe'
import { StripePaymentService } from './stripe-payment.service.js'
import { StripePaymentController } from './stripe-payment.controller.js'

@Module({
  imports: [StripeModule],
  controllers: [StripePaymentController],
  providers: [StripePaymentService]
})
export class StripePaymentModule {}
