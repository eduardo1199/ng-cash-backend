import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('email').notNullable()
    table.uuid('session_id').index()
  })

  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary()
    table.decimal('amount').notNullable()
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now())
    table.enum('type', ['income', 'outcome']).notNullable()

    table.uuid('user_id').unsigned()
    table.foreign('user_id').references('id').inTable('users')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
  await knex.schema.dropTable('transactions')
}
