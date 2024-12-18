import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('transaction_statuses', (table) => {
      table.increments('id').primary()
      table.string('status').notNullable().unique()
    })
    .then(() =>
      knex('transaction_statuses').insert([{ status: 'pending' }, { status: 'completed' }, { status: 'failed' }])
    )
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transaction_statuses')
}
