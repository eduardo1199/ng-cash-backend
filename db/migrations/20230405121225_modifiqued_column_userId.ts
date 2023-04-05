import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.uuid('user_id').nullable().alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.uuid('user_id').notNullable().alter()
  })
}
