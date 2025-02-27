import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex('statuses').insert([
    { status: 'incomplete' },
    { status: 'incomplete_expired' },
    { status: 'past_due' },
    { status: 'unpaid' }
  ])
}

export async function down(knex: Knex): Promise<void> {
  await knex('statuses')
    .whereIn('status', [
      { status: 'incomplete' },
      { status: 'incomplete_expired' },
      { status: 'past_due' },
      { status: 'unpaid' }
    ])
    .delete()
}
