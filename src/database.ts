import { knex as setupKnex, Knex } from 'knex'

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: './db/dev.db',
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: 'db/migrations',
  },
}

export const knex = setupKnex(config)
