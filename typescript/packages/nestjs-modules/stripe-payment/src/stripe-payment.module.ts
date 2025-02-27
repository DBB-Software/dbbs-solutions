import { Module } from '@nestjs/common'
import { StripeModule } from '@dbbs/nestjs-module-stripe'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from '@dbbs/nestjs-module-logger'

import { SendgridModule } from '@dbbs/nestjs-module-sendgrid'
import {
  ProductRepository,
  PlanRepository,
  UserRepository,
  CheckoutSessionMetadataRepository,
  PurchaseRepository,
  TransactionRepository,
  InviteRepository,
  SubscriptionRepository,
  OrganizationRepository
} from './repositories/index.js'
import {
  ProductService,
  PlanService,
  SubscriptionService,
  OrganizationService,
  PurchaseService,
  TransactionService,
  InviteService,
  CheckoutSessionMetadataService
} from './services/index.js'
import {
  OrganizationController,
  PlanController,
  ProductController,
  SubscriptionController,
  UserController
} from './controllers/index.js'
import { WebhookController } from './webhook/webhook.controller.js'
import { WebhookService } from './webhook/webhook.service.js'
import { StripeWebhookGuard } from './webhook/webhook.guard.js'

@Module({
  imports: [
    ConfigModule.forRoot(),
    StripeModule.forRootAsync({ apiKey: process.env.STRIPE_SECRET_KEY }),
    LoggerModule,
    SendgridModule
  ],
  controllers: [
    ProductController,
    PlanController,
    WebhookController,
    SubscriptionController,
    OrganizationController,
    UserController
  ],
  providers: [
    ProductRepository,
    ProductService,
    PlanRepository,
    PlanService,
    SubscriptionService,
    SubscriptionRepository,
    OrganizationRepository,
    OrganizationService,
    UserRepository,
    CheckoutSessionMetadataRepository,
    CheckoutSessionMetadataService,
    PurchaseRepository,
    PurchaseService,
    TransactionRepository,
    TransactionService,
    WebhookService,
    StripeWebhookGuard,
    InviteService,
    InviteRepository
  ]
})
export class StripePaymentModule {}
