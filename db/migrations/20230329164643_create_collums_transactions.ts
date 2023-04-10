import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('transactions', (table) => {
    table.text('description')
    table.text('category')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('transactions', (table) => {
    table.dropColumn('description')
    table.dropColumn('category')
  })
}
