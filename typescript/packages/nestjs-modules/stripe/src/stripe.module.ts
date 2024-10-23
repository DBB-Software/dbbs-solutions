import { DynamicModule, Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import Stripe from 'stripe'
import { STRIPE_SDK } from './constants.js'
import { ProductService } from './services/product.service.js'
import { SubscriptionService } from './services/subscription.service.js'
import { PlanService } from './services/plan.service.js'
import { OrganizationService } from './services/organization.service.js'
import { StripeService } from './stripe.service.js'

interface StripeModuleOptions {
  apiKey?: string
}

@Global()
@Module({})
export class StripeModule {
  static forRootAsync(options: StripeModuleOptions): DynamicModule {
    const { apiKey } = options

    if (!apiKey) {
      throw new Error('Api key is not provided')
    }

    return {
      module: StripeModule,
      imports: [ConfigModule.forRoot()],
      providers: [
        ProductService,
        SubscriptionService,
        PlanService,
        OrganizationService,
        {
          provide: STRIPE_SDK,
          useValue: new Stripe(apiKey)
        },
        StripeService
      ],
      exports: [STRIPE_SDK, ProductService, SubscriptionService, PlanService, OrganizationService, StripeService]
    }
  }
}
