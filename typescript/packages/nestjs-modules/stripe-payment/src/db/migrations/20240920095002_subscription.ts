import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('subscriptions', (table) => {
    table.increments('id').primary()
    table.string('stripeId').notNullable()

    table
      .integer('organizationId')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('organizations')
      .onDelete('CASCADE')

    table.integer('planId').unsigned().notNullable().references('id').inTable('plans')

    table.integer('statusId').unsigned().notNullable().references('id').inTable('statuses')

    table.integer('quantity').unsigned().notNullable()

    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('subscriptions')
}
