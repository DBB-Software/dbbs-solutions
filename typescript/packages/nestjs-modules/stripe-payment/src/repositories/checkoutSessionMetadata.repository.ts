import knex from 'knex'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from 'nest-knexjs'
import { CheckoutSessionMetadataDbRecord, CreateCheckoutSessionMetadataPayload } from '../types/index.js'
import { CheckoutSessionMetadataEntity } from '../entites/checkoutSessionMetadata.entity.js'

@Injectable()
export class CheckoutSessionMetadataRepository {
  static toJSON({
    id,
    checkoutSessionStripeId,
    organizationName,
    planId,
    userId,
    quantity,
    createdAt,
    updatedAt
  }: CheckoutSessionMetadataDbRecord): CheckoutSessionMetadataEntity {
    return {
      id,
      checkoutSessionStripeId,
      organizationName,
      planId,
      userId,
      quantity,
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt)
    }
  }

  constructor(@InjectConnection() private readonly knexConnection: knex.Knex) {}

  async getMetadataByCheckoutSessionStripeId(checkoutSessionStripeId: string) {
    const metadata = await this.knexConnection('checkout_sessions_metadata')
      .select('*')
      .where({ checkoutSessionStripeId })
      .first()

    return metadata ? CheckoutSessionMetadataRepository.toJSON(metadata) : null
  }

  async saveMetadata(payload: CreateCheckoutSessionMetadataPayload): Promise<void> {
    await this.knexConnection('checkout_sessions_metadata').insert(payload)
  }
}
