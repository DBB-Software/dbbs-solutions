import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('purchases', (table) => {
    table.increments('id').primary()
    table.string('stripeId').notNullable()

    table.integer('planId').unsigned().references('id').inTable('plans')

    table.integer('organizationId').unsigned().references('id').inTable('organizations')

    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('purchases')
}
