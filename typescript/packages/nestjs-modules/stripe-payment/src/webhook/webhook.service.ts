import { Injectable } from '@nestjs/common'
import {
  ProductService as StripeProductService,
  StripePriceCreatedEvent,
  StripePriceDeletedEvent,
  StripePriceUpdatedEvent,
  StripeProductCreatedEvent,
  StripeProductDeletedEvent,
  StripeProductUpdatedEvent
} from '@dbbs/nestjs-module-stripe'
import { ProductRepository } from '../repositories/product.repository.js'
import { PlanRepository } from '../repositories/plan.repository.js'
import { BillingPeriod, PlanType } from '../enums/index.js'
import { handleDbCreateError } from './utils/handleDbCreateError.js'
import { DatabaseError } from '../interfaces/index.js'

@Injectable()
export class WebhookService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly planRepository: PlanRepository,
    private readonly stripeProductService: StripeProductService
  ) {}

  async handleProductCreated(event: StripeProductCreatedEvent) {
    const { id: stripeId, name } = event.data.object

    try {
      return await this.productRepository.createProduct({ name, stripeId })
    } catch (error) {
      return handleDbCreateError(error as DatabaseError)
    }
  }

  async handleProductUpdated(event: StripeProductUpdatedEvent) {
    const { id: stripeId, name } = event.data.object

    const product = await this.productRepository.getProductByStripeId(stripeId)
    if (!product) {
      return null
    }

    return this.productRepository.updateProduct({ id: product.id, name })
  }

  async handleProductDeleted(event: StripeProductDeletedEvent) {
    const { id: stripeId } = event.data.object

    const product = await this.productRepository.getProductByStripeId(stripeId)
    if (!product) {
      return null
    }

    return this.productRepository.deleteProduct(product.id)
  }

  async handlePriceCreated(event: StripePriceCreatedEvent) {
    const stripePrice = event.data.object

    let product = await this.productRepository.getProductByStripeId(stripePrice.product as string)
    if (!product) {
      const { id: stripeId, name } = await this.stripeProductService.getProductById({
        id: stripePrice.product as string
      })

      product = await this.productRepository.createProduct({ stripeId, name })
    }

    try {
      return await this.planRepository.createPlan({
        price: (stripePrice.unit_amount as number) / 100,
        interval: stripePrice.recurring?.interval as BillingPeriod | undefined,
        stripeId: stripePrice.id,
        productId: product.id,
        type: stripePrice.type as PlanType
      })
    } catch (error) {
      return handleDbCreateError(error as DatabaseError)
    }
  }

  async handlePriceDeleted(event: StripePriceDeletedEvent) {
    const { id: stripeId } = event.data.object

    const plan = await this.planRepository.getPlanByStripeId(stripeId)
    if (!plan) {
      return null
    }

    return this.planRepository.deletePlan(plan.id)
  }

  async handlePriceUpdated(event: StripePriceUpdatedEvent) {
    const { id: stripeId, type, unit_amount: unitAmount, recurring } = event.data.object

    const plan = await this.planRepository.getPlanByStripeId(stripeId)
    if (!plan) {
      return null
    }

    return this.planRepository.updatePlan({
      id: plan.id,
      type: type as PlanType,
      interval: (recurring?.interval as BillingPeriod | undefined) || null,
      price: (unitAmount as number) / 100
    })
  }
}
