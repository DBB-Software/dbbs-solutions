import knex from 'knex'
import {
  dbOrganizationsList,
  dbOrganizationsUsersLinksList,
  dbSubscriptionsList,
  defaultDateISOString
} from '../mocks/index.js'
import { PlanDbRecord, ProductDbRecord, UserDbRecord } from '../../types/index.js'
import { dbPurchasesList } from '../mocks/purchase.mock.js'
import { dbTransactionsList } from '../mocks/transaction.mock.js'
import { dbCheckoutSessionMetadataList } from '../mocks/checkoutSessionMetadata.mock.js'

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

export const createOrganizationsTable = async (db: knex.Knex, data: ReturnType<typeof dbOrganizationsList>) => {
  const tableExists = await db.schema.hasTable('organizations')

  if (!tableExists) {
    await db.schema.createTable('organizations', (table) => {
      table.increments('id')
      table.string('name')
      table.string('stripeCustomerId')
      table.string('paymentMethodId')
      table.integer('ownerId')
      table.integer('subscription')
      table.integer('quantity')
      table.datetime('createdAt').defaultTo(defaultDateISOString)
      table.datetime('updatedAt').defaultTo(defaultDateISOString)
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

export const createOrganizationsUsersLinksTable = async (
  db: knex.Knex,
  data: ReturnType<typeof dbOrganizationsUsersLinksList>
) => {
  const tableExists = await db.schema.hasTable('organizations_users')

  if (!tableExists) {
    await db.schema.createTable('organizations_users', (table) => {
      table.integer('organizationId')
      table.integer('userId')
    })
  }

  await db.table('organizations_users').insert(data)
}

export const createCheckoutSessionMetadataTable = async (
  db: knex.Knex,
  data: ReturnType<typeof dbCheckoutSessionMetadataList>
) => {
  const tableExists = await db.schema.hasTable('checkout_sessions_metadata')

  if (!tableExists) {
    await db.schema.createTable('checkout_sessions_metadata', (table) => {
      table.increments('id').primary()
      table.string('checkoutSessionStripeId')
      table.string('organizationName')
      table.integer('planId').unsigned()
      table.integer('userId').unsigned()
      table.integer('quantity')

      table.timestamps(true, true, true)
    })
  }

  await db.table('checkout_sessions_metadata').insert(data)
}

export const createPurchasesTable = async (db: knex.Knex, data: ReturnType<typeof dbPurchasesList>) => {
  const tableExists = await db.schema.hasTable('purchases')

  if (!tableExists) {
    await db.schema.createTable('purchases', (table) => {
      table.increments('id').primary()
      table.string('stripeId')

      table.integer('planId')
      table.integer('organizationId')

      table.timestamps(true, true, true)
    })
  }

  await db.table('purchases').insert(data)
}

export const createTransactionStatusesTable = async (db: knex.Knex) => {
  const tableExists = await db.schema.hasTable('transaction_statuses')

  if (!tableExists) {
    await db.schema.createTable('transaction_statuses', (table) => {
      table.increments('id')
      table.string('status').notNullable().unique()
    })
  }

  const existingStatuses = await db('transaction_statuses').count('id as count').first()

  if (!existingStatuses?.count) {
    await db
      .table('transaction_statuses')
      .insert([{ status: 'pending' }, { status: 'completed' }, { status: 'failed' }])
  }
}

export const createTransactionsTable = async (db: knex.Knex, data: ReturnType<typeof dbTransactionsList>) => {
  const tableExists = await db.schema.hasTable('transactions')

  if (!tableExists) {
    await db.schema.createTable('transactions', (table) => {
      table.increments('id').primary()
      table.integer('subscriptionId').notNullable()
      table.integer('organizationId').unsigned()
      table.integer('purchaseId').notNullable()
      table.integer('statusId').unsigned()
      table.text('stripeInvoiceId')
      table.timestamps(true, true, true)
    })
  }

  await db.table('transactions').insert(data)
}
