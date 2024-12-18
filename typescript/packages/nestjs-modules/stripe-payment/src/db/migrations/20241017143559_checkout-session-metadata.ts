import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('checkout_sessions_metadata', (table) => {
    table.increments('id').primary()
    table.string('checkoutSessionStripeId').notNullable().unique()
    table.string('organizationName').notNullable().references('name').inTable('organizations')
    table.integer('planId').unsigned().notNullable().references('id').inTable('plans')
    table.integer('userId').unsigned().notNullable().references('id').inTable('users')
    table.integer('quantity').notNullable()

    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('checkout_sessions_metadata')
}
