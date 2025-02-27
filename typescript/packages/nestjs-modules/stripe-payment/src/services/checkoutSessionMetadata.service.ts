import { Injectable } from '@nestjs/common'
import { ICheckoutSessionMetadata } from '../interfaces/index.js'

@Injectable()
export class CheckoutSessionMetadataService {
  validateMetadata(metadata: ICheckoutSessionMetadata) {
    const errors: string[] = []

    if (!metadata.id || metadata.id < 0) {
      errors.push('id must be a positive number')
    }

    if (!metadata.checkoutSessionStripeId) {
      errors.push('checkoutSessionStripeId must be a non-empty string')
    }

    if (!metadata.organizationId || metadata.organizationId < 0) {
      errors.push('organizationId must be a positive number')
    }

    if (!metadata.planId || metadata.planId < 0) {
      errors.push('planId must be a positive number')
    }

    if (!metadata.quantity || metadata.quantity < 0) {
      errors.push('quantity must be a positive number')
    }

    if (errors.length) {
      throw new Error(`Invalid metadata: ${errors.join(', ')}`)
    }
  }
}
