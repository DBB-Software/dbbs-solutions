import knex from 'knex'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from 'nest-knexjs'
import { CreatePlanPayload, PlanDbRecord, UpdatePlanPayload } from '../types/index.js'
import { PlanEntity } from '../entites/index.js'

@Injectable()
export class PlanRepository {
  constructor(@InjectConnection() private readonly knexConnection: knex.Knex) {}

  static toJSON(planRecord: PlanDbRecord): PlanEntity {
    return {
      id: planRecord.id,
      price: planRecord.price,
      stripeId: planRecord.stripeId,
      interval: planRecord.interval,
      type: planRecord.type,
      productId: planRecord.productId,
      createdAt: new Date(planRecord.createdAt),
      updatedAt: new Date(planRecord.updatedAt)
    }
  }

  async getPlanById(id: number): Promise<PlanEntity | null> {
    const plan = await this.knexConnection('plans').select('*').where({ id }).first()

    return plan ? PlanRepository.toJSON(plan) : null
  }

  async planExistsByStripeId(stripeId: string): Promise<boolean> {
    const result = await this.knexConnection('plans')
      .where('stripeId', stripeId)
      .count({ count: '*' })
      .first<{ count: number | string }>()

    return Boolean(result.count)
  }

  async getPlanByStripeId(stripeId: string): Promise<PlanEntity | null> {
    const plan = await this.knexConnection('plans').select('*').where({ stripeId }).first()

    return plan ? PlanRepository.toJSON(plan) : null
  }

  async createPlan({ price, interval, stripeId, productId, type }: CreatePlanPayload): Promise<PlanEntity> {
    const [plan] = await this.knexConnection('plans')
      .insert({
        price,
        interval,
        type,
        stripeId,
        productId
      })
      .returning('*')

    return PlanRepository.toJSON(plan)
  }

  async updatePlan(payload: UpdatePlanPayload): Promise<PlanEntity | null> {
    const { id, ...fieldsToUpdate } = payload

    const [updatedPlan] = await this.knexConnection('plans').update(fieldsToUpdate).where({ id }).returning('*')

    return updatedPlan ? PlanRepository.toJSON(updatedPlan) : null
  }

  deletePlan(id: number): Promise<number> {
    return this.knexConnection('plans').delete().where({ id })
  }
}
