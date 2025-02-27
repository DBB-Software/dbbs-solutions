import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary()
    table.integer('subscriptionId').unsigned().references('id').inTable('subscriptions')
    table.integer('purchaseId').unsigned().references('id').inTable('purchases')
    table.integer('organizationId').unsigned().notNullable().references('id').inTable('organizations')
    table.integer('statusId').unsigned().notNullable().references('id').inTable('transaction_statuses')
    table.text('stripeInvoiceId')
    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('transactions')
}
