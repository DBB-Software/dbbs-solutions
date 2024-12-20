import knex from 'knex'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from 'nest-knexjs'

import { SubscriptionRepository } from './subscription.repository.js'
import {
  CreateOrganizationPayload,
  OrganizationDbRecord,
  PaginationOptions,
  UpdateOrganizationPayload
} from '../types/index.js'
import { OrganizationEntity } from '../entites/index.js'

@Injectable()
export class OrganizationRepository {
  constructor(@InjectConnection() private readonly knexConnection: knex.Knex) {}

  public static toJSON({
    id,
    name,
    stripeCustomerId,
    paymentMethodId,
    ownerId,
    subscription,
    purchases,
    quantity,
    transactions,
    invites,
    createdAt,
    updatedAt
  }: OrganizationDbRecord): OrganizationEntity {
    return {
      id,
      name,
      stripeCustomerId,
      paymentMethodId,
      ownerId,
      // TODO users: UserDbRecord
      subscription:
        subscription && (typeof subscription === 'number' ? subscription : SubscriptionRepository.toJSON(subscription)),
      // TODO PurchaseRepository.toJSON
      purchases: purchases?.length ? purchases : undefined,
      quantity,
      // TODO TransactionRepository.toJSON
      transactions: transactions?.length ? transactions : undefined,
      // TODO InviteRepository.toJSON
      invites: invites?.length ? invites : undefined,
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt)
    }
  }

  async organizationExists(id: number): Promise<boolean> {
    const result = await this.knexConnection('organizations').count({ count: '*' }).where({ id }).first()

    return Boolean(result?.count)
  }

  async organizationExistsByName(name: string): Promise<boolean> {
    const result = await this.knexConnection('organizations').count({ count: '*' }).where({ name }).first()

    return Boolean(result?.count)
  }

  async countUsers(id: number): Promise<number> {
    const result = await this.knexConnection('organizations_users')
      .where('organizationId', id)
      .count({ count: '*' })
      .first<{ count: number | string }>()

    return Number(result.count)
  }

  async getQuantity(id: number): Promise<number | undefined> {
    const result = await this.knexConnection('organizations').select('quantity').where({ id }).first()
    return result?.quantity
  }

  async createOrganization(payload: CreateOrganizationPayload): Promise<OrganizationEntity> {
    const { name, stripeCustomerId, ownerId, quantity } = payload

    // Todo handle case when insert is failed

    const [createdOrganization] = await this.knexConnection('organizations')
      .insert({ name, stripeCustomerId, ownerId, quantity })
      .returning('*')

    await this.knexConnection('organizations_users').insert({
      organizationId: createdOrganization.id,
      userId: ownerId
    })

    return OrganizationRepository.toJSON(createdOrganization)
  }

  async getOrganizationById(id: number, populate: boolean = false): Promise<OrganizationEntity | null> {
    const query = this.getOrganizationsBaseQuery(populate).where('organizations.id', id)

    const organization = await query.first()

    // TODO parse invites, purchases, transactions
    return organization
      ? OrganizationRepository.toJSON({ ...organization, subscription: JSON.parse(organization.subscription) })
      : null
  }

  async getOrganizationByStripeCustomerId(
    stripeCustomerId: string,
    populate: boolean = false
  ): Promise<OrganizationEntity | null> {
    const query = this.getOrganizationsBaseQuery(populate).where('organizations.stripeCustomerId', stripeCustomerId)

    const organization = await query.first()

    // TODO parse invites, purchases, transactions
    return organization
      ? OrganizationRepository.toJSON({ ...organization, subscription: JSON.parse(organization.subscription) })
      : null
  }

  async getAll(
    paginationOptions: PaginationOptions = { skip: 0, limit: 10 }
  ): Promise<{ organizations: OrganizationEntity[]; total: number }> {
    const { skip = 0, limit = 10 } = paginationOptions

    const organizations = await this.getOrganizationsBaseQuery(false)
      .groupBy('organizations.id')
      .orderBy('organizations.id', 'asc')
      .offset(skip)
      .limit(limit)

    const totalQueryResult = await this.knexConnection('organizations').count('id as total').first()
    const total = Number(totalQueryResult?.total) || 0

    // TODO parse invites, purchases, transactions
    return {
      organizations: organizations.map((organization) =>
        OrganizationRepository.toJSON({
          ...organization,
          subscription: JSON.parse(organization.subscription)
        })
      ),
      total
    }
  }

  private getOrganizationsBaseQuery(populate: boolean = true) {
    const query = this.knexConnection('organizations').select('organizations.*')

    if (!populate) {
      return query
    }
    // TODO invites, purchases, transactions, users
    return query.join('subscriptions', 'subscriptions.organizationId', 'organizations.id').select(
      this.knexConnection.raw(
        `
            json_object(
              'id', subscriptions.id,
              'stripeId', subscriptions.stripeId,
              'plan', subscriptions.planId,
              'status', subscriptions.statusId,
              'quantity', subscriptions.quantity,
              'createdAt', subscriptions.createdAt,
              'updatedAt', subscriptions.updatedAt
            )
        `
      )
    )
  }

  async updateOrganization(payload: UpdateOrganizationPayload): Promise<OrganizationEntity | null> {
    const { id, ...fieldsToUpdate } = payload

    const [updatedOrganization] = await this.knexConnection('organizations')
      .update(fieldsToUpdate)
      .where({ id })
      .returning('*')

    return updatedOrganization ? OrganizationRepository.toJSON(updatedOrganization) : null
  }

  deleteOrganization(id: number): Promise<number> {
    return this.knexConnection('organizations').delete().where({ id })
  }

  async getUserOrganizations(userId: number): Promise<OrganizationEntity[]> {
    const organizations = await this.knexConnection('organizations')
      .select('organizations.*')
      .join('organizations_users', 'organizations.id', 'organizations_users.organizationId')
      .where({ 'organizations_users.userId': userId })
      .groupBy('organizations.id')
      .orderBy('organizations.id', 'asc')

    return organizations.map(OrganizationRepository.toJSON)
  }
}
