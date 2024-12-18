import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('firstname').notNullable()
    table.string('lastname').nullable()
    table.string('email').nullable()
    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTableIfExists('users')
}
