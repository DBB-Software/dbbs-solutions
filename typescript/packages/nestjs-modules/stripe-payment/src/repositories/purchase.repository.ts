import { Injectable } from '@nestjs/common'
import { InjectConnection } from 'nest-knexjs'
import knex from 'knex'

import { CreatePurchasePayload, PaginationOptions, PurchaseDbRecord } from '../types/index.js'
import { PlanRepository } from './plan.repository.js'
import { PurchaseEntity } from '../entites/index.js'

@Injectable()
export class PurchaseRepository {
  constructor(@InjectConnection() private readonly knexConnection: knex.Knex) {}

  static toJSON({ id, stripeId, organizationId, plan, createdAt, updatedAt }: PurchaseDbRecord): PurchaseEntity {
    return {
      id,
      stripeId,
      organizationId,
      plan: PlanRepository.toJSON(plan),
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt)
    }
  }

  async getOrganizationPurchases(
    organizationId: number,
    paginationOptions: PaginationOptions = { skip: 0, limit: 10 }
  ): Promise<{ purchases: PurchaseEntity[]; total: number }> {
    const { skip = 0, limit = 10 } = paginationOptions

    const baseQuery = this.knexConnection('purchases')
      .select(
        'purchases.id',
        'purchases.stripeId',
        'purchases.organizationId',
        'purchases.createdAt',
        'purchases.updatedAt'
      )
      .join('plans', 'purchases.planId', '=', 'plans.id')
      .select(
        this.knexConnection.raw(
          `
            json_object(
              'id', \`plans\`.\`id\`,
              'interval', \`plans\`.\`interval\`,
              'stripeId', \`plans\`.\`stripeId\`,
              'type', \`plans\`.\`type\`,
              'price', \`plans\`.\`price\`,
              'productId', \`plans\`.\`productId\`,
              'createdAt', \`plans\`.\`createdAt\`,
              'updatedAt', \`plans\`.\`updatedAt\`
            ) as plan
          `
        )
      )
      .where({ organizationId })

    const purchases = await baseQuery.offset(skip).limit(limit)
    const totalQueryResult = await baseQuery.count('purchases.id as total').first()
    const total = Number(totalQueryResult?.total) || 0

    return {
      purchases: purchases.map((purchase) =>
        PurchaseRepository.toJSON({ ...purchase, plan: JSON.parse(purchase.plan) })
      ),
      total
    }
  }

  async createPurchase(payload: CreatePurchasePayload): Promise<number> {
    const [{ id }] = await this.knexConnection('purchases').insert(payload).returning('id')

    return Number(id)
  }
}
