import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('organizations', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('stripeCustomerId').notNullable()
    table.string('paymentMethodId').nullable()
    table.string('ownerId').nullable()
    table.integer('quantity').nullable()
    table
      .integer('subscription')
      .unsigned()
      .nullable()
      .references('organizationId')
      .inTable('subscriptions')
      .onDelete('CASCADE')
    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('organizations')
}
