import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable('organizations_users', (table) => {
    table.integer('organizationId').unsigned().notNullable().references('id').inTable('organizations')
    table.integer('userId').unsigned().notNullable().references('id').inTable('users')
  })
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTableIfExists('organizations_users')
}
