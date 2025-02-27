import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { StripeEvent } from '@dbbs/nestjs-module-stripe'
import { WebhookService } from './webhook.service.js'
import { StripeWebhookGuard } from './webhook.guard.js'
import { StripeEventType } from '../enums/index.js'

@Controller('webhook')
@UseGuards(StripeWebhookGuard)
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async handleEvent(@Body() event: StripeEvent) {
    switch (event.type) {
      case StripeEventType.ProductCreated:
        await this.webhookService.handleProductCreated(event)
        break
      case StripeEventType.ProductUpdated:
        await this.webhookService.handleProductUpdated(event)
        break
      case StripeEventType.ProductDeleted:
        await this.webhookService.handleProductDeleted(event)
        break
      case StripeEventType.PriceCreated:
        await this.webhookService.handlePriceCreated(event)
        break
      case StripeEventType.PriceDeleted:
        await this.webhookService.handlePriceDeleted(event)
        break
      case StripeEventType.PriceUpdated:
        await this.webhookService.handlePriceUpdated(event)
        break
      case StripeEventType.CheckoutSessionCompleted:
        await this.webhookService.handleCheckoutSessionCompleted(event)
        break
      case StripeEventType.InvoicePaymentSucceeded:
        await this.webhookService.handleInvoicePaymentSucceeded(event)
        break
      case StripeEventType.InvoicePaymentFailed:
        await this.webhookService.handleInvoicePaymentFailed(event)
        break
      case StripeEventType.CustomerSubscriptionUpdated:
        await this.webhookService.handleSubscriptionUpdated(event)
        break
      default:
        break
    }
  }
}
