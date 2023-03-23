import { knex as setupKnex, Knex } from 'knex'
import { env } from './env/validate'

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: env.DIRECTORY_DATABASE,
  },
}

export const knex = setupKnex(config)
