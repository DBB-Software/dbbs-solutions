import knex from 'knex'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from 'nest-knexjs'
import { SubscriptionEntity } from '../entites/index.js'
import { PaginationOptions, ResubscribePayload, SubscriptionDbRecord } from '../types/index.js'
import { PlanRepository } from './plan.repository.js'
import { SubscriptionStatusId } from '../enums/index.js'

@Injectable()
export class SubscriptionRepository {
  constructor(@InjectConnection() private readonly knexConnection: knex.Knex) {}

  public static toJSON(subscription: SubscriptionDbRecord): SubscriptionEntity {
    const { id, stripeId, plan, organization, status, quantity, createdAt, updatedAt } = subscription

    return {
      id,
      stripeId,
      // FIXME: change to `string` in case uuid is used for plan id in the database
      plan: typeof plan === 'number' ? plan : PlanRepository.toJSON(plan),
      organization,
      status,
      quantity,
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt)
    }
  }

  private async updateSubscriptionField(
    id: number,
    field: Partial<{ statusId: SubscriptionStatusId; quantity: number }>
  ): Promise<SubscriptionEntity | null> {
    const [updatedSubscription] = await this.knexConnection('subscriptions')
      .update(field)
      .where({ id })
      .returning([
        'id',
        'stripeId',
        'organizationId as organization',
        'planId as plan',
        'statusId as status',
        'quantity',
        'createdAt',
        'updatedAt'
      ])

    return updatedSubscription ? SubscriptionRepository.toJSON(updatedSubscription) : null
  }

  private getSubscriptionBaseQuery(populate: boolean = true) {
    let query = this.knexConnection('subscriptions').select(
      'subscriptions.id',
      'subscriptions.stripeId',
      'subscriptions.quantity',
      'subscriptions.createdAt',
      'subscriptions.updatedAt'
    )

    if (populate) {
      query = query
        .join('plans', 'subscriptions.planId', '=', 'plans.id')
        .join('organizations', 'subscriptions.organizationId', '=', 'organizations.id')
        .join('statuses', 'subscriptions.statusId', '=', 'statuses.id')
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
          ),
          this.knexConnection.raw(
            `
              json_object(
                'id', \`organizations\`.\`id\`,
                'name', \`organizations\`.\`name\`,
                'quantity', \`organizations\`.\`quantity\`,
                'stripeCustomerId', \`organizations\`.\`stripeCustomerId\`
              ) as organization
            `
          ),
          'statuses.status as status'
        )
    }

    return query
  }

  async getSubscriptions(
    paginationOptions: PaginationOptions = { skip: 0, limit: 10 }
  ): Promise<{ subscriptions: SubscriptionEntity[]; total: number }> {
    const { skip = 0, limit = 10 } = paginationOptions

    const subscriptionsQuery = this.getSubscriptionBaseQuery(true)
      .groupBy('subscriptions.id')
      .orderBy('subscriptions.id', 'asc')
      .offset(skip)
      .limit(limit)

    const subscriptions = await subscriptionsQuery
    const totalQueryResult = await this.knexConnection('subscriptions').count('id as total').first()
    const total = Number(totalQueryResult?.total) || 0

    return {
      subscriptions: subscriptions.map((subscription) =>
        SubscriptionRepository.toJSON({
          ...subscription,
          plan: JSON.parse(subscription.plan),
          organization: JSON.parse(subscription.organization)
        })
      ),
      total
    }
  }

  async getSubscriptionById(id: number, populate: boolean = true): Promise<SubscriptionEntity | null> {
    const query = this.getSubscriptionBaseQuery(populate).where('subscriptions.id', id)

    if (!populate) {
      query.select(
        'subscriptions.planId as plan',
        'subscriptions.statusId as status',
        'subscriptions.organizationId as organization'
      )
    }

    const subscription = await query.first()

    return subscription
      ? SubscriptionRepository.toJSON({
          ...subscription,
          plan: JSON.parse(subscription.plan),
          organization: JSON.parse(subscription.organization)
        })
      : null
  }

  async updateSubscriptionStatus(id: number, statusId: SubscriptionStatusId): Promise<SubscriptionEntity | null> {
    return this.updateSubscriptionField(id, { statusId })
  }

  async updateSubscriptionQuantity(id: number, quantity: number): Promise<SubscriptionEntity | null> {
    return this.updateSubscriptionField(id, { quantity })
  }

  async resubscribe(id: number, payload: ResubscribePayload): Promise<number> {
    return this.knexConnection('subscriptions').update(payload).where({ id })
  }

  async deleteSubscription(id: number): Promise<number> {
    return this.knexConnection('subscriptions').delete().where({ id })
  }
}
