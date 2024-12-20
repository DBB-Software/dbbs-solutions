import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('invites_statuses', (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.timestamps(true, true, true)
    })
    .then(() => {
      knex('invites_statuses').insert([{ name: 'pending' }, { name: 'accepted' }, { name: 'canceled' }])
    })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('invites_statuses')
}
