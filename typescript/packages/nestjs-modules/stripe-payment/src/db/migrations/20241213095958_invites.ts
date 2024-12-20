import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('invites', (table) => {
    table.increments('id').primary()
    table.string('token').notNullable()
    table.string('email').notNullable()
    table.integer('userId').unsigned().references('id').inTable('users')
    table.integer('organizationId').unsigned().references('id').inTable('organizations')
    table.integer('statusId').unsigned().notNullable().references('id').inTable('invites_statuses')
    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('invites')
}
