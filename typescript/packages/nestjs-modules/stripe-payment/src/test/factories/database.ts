import knex from 'knex'
import { dbSubscriptionsList, defaultDateISOString } from '../mocks/index.js'
import { OrganizationDbRecord, PlanDbRecord, ProductDbRecord, UserDbRecord } from '../../types/index.js'

export const createProductsTable = async (db: knex.Knex, data: ProductDbRecord[]) => {
  const tableExists = await db.schema.hasTable('products')

  if (!tableExists) {
    await db.schema.createTable('products', (table) => {
      table.increments('id')
      table.string('stripeId')
      table.string('name')
      table.datetime('createdAt').defaultTo(defaultDateISOString)
      table.datetime('updatedAt').defaultTo(defaultDateISOString)
    })
  }

  await db.table('products').insert(data)
}

export const createPlansTable = async (db: knex.Knex, data: PlanDbRecord[]) => {
  const tableExists = await db.schema.hasTable('plans')

  if (!tableExists) {
    await db.schema.createTable('plans', (table) => {
      table.increments('id')
      table.string('stripeId')
      table.integer('productId').references('products.id')
      table.string('type')
      table.integer('price')
      table.integer('interval')
      table.datetime('createdAt').defaultTo(defaultDateISOString)
      table.datetime('updatedAt').defaultTo(defaultDateISOString)
    })
  }

  await db.table('plans').insert(data)
}

export const createOrganizationsTable = async (db: knex.Knex, data: OrganizationDbRecord[]) => {
  const tableExists = await db.schema.hasTable('organizations')

  if (!tableExists) {
    await db.schema.createTable('organizations', (table) => {
      table.increments('id')
      table.string('name')
      table.integer('quantity')
      table.string('stripeCustomerId')
    })
  }

  await db.table('organizations').insert(data)
}

export const createUsersTable = async (db: knex.Knex, data: UserDbRecord[]) => {
  const tableExists = await db.schema.hasTable('users')

  if (!tableExists) {
    await db.schema.createTable('users', (table) => {
      table.increments('id')
      table.string('username')
      table.string('email')
      table.string('provider')
      table.string('password')
      table.string('resetPasswordToken')
      table.string('confirmationToken')
      table.integer('confirmed')
      table.integer('blocked')
      table.integer('organizationId')
      table.string('createdAt')
      table.string('updatedAt')
    })
  }

  await db.table('users').insert(data)
}

export const createStatusesTable = async (db: knex.Knex) => {
  const tableExists = await db.schema.hasTable('statuses')

  if (!tableExists) {
    await db.schema.createTable('statuses', (table) => {
      table.increments('id')
      table.string('status').notNullable().unique()
    })
  }

  const existingStatuses = await db('statuses').count('id as count').first()

  if (!existingStatuses?.count) {
    await db
      .table('statuses')
      .insert([{ status: 'trialing' }, { status: 'active' }, { status: 'cancelled' }, { status: 'paused' }])
  }
}

export const createSubscriptionsTable = async (db: knex.Knex, data: ReturnType<typeof dbSubscriptionsList>) => {
  const tableExists = await db.schema.hasTable('subscriptions')

  if (!tableExists) {
    await db.schema.createTable('subscriptions', (table) => {
      table.increments('id')
      table.string('stripeId')

      table.integer('organizationId')
      table.integer('planId')
      table.integer('statusId')
      table.integer('quantity')

      table.timestamps(true, true, true)
    })
  }

  await db.table('subscriptions').insert(data)
}
