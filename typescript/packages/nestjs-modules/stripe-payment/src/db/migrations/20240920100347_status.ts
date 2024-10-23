import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('statuses', (table) => {
      table.increments('id').primary()
      table.string('status').notNullable().unique()
    })
    .then(() =>
      knex('statuses').insert([
        { status: 'trialing' },
        { status: 'active' },
        { status: 'canceled' },
        { status: 'paused' }
      ])
    )
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('statuses')
}
