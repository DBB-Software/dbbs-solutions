import { Module } from '@nestjs/common'
import { StripeModule } from '@dbbs/nestjs-module-stripe'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from '@dbbs/nestjs-module-logger'
import { ProductRepository } from './repositories/product.repository.js'
import { ProductService } from './services/product.service.js'
import { ProductController } from './controllers/product.controller.js'
import { WebhookController } from './webhook/webhook.controller.js'
import { WebhookService } from './webhook/webhook.service.js'
import { StripeWebhookGuard } from './webhook/webhook.guard.js'
import { PlanController } from './controllers/plan.controller.js'
import { PlanRepository } from './repositories/plan.repository.js'
import { PlanService } from './services/plan.service.js'
import { SubscriptionController } from './controllers/subscription.controller.js'
import { SubscriptionService } from './services/subscription.service.js'
import { SubscriptionRepository } from './repositories/subscription.repository.js'
import { OrganizationRepository } from './repositories/organization.repository.js'
import { UserRepository } from './repositories/user.repository.js'

@Module({
  imports: [ConfigModule.forRoot(), StripeModule.forRootAsync({ apiKey: process.env.STRIPE_SECRET_KEY }), LoggerModule],
  controllers: [ProductController, PlanController, WebhookController, SubscriptionController],
  providers: [
    ProductRepository,
    ProductService,
    PlanRepository,
    PlanService,
    SubscriptionService,
    SubscriptionRepository,
    OrganizationRepository,
    UserRepository,
    WebhookService,
    StripeWebhookGuard
  ]
})
export class StripePaymentModule {}
