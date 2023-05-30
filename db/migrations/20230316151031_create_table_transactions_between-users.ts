import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions_users', (table) => {
    table.uuid('id').primary()

    table.uuid('user_id').unsigned()
    table.foreign('user_id').references('id').inTable('users')

    table.uuid('transaction_id').unsigned()
    table.foreign('transaction_id').references('id').inTable('transactions')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions_users')
}
