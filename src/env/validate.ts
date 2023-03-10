import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DIRECTORY_DATABASE: z.string().default('db/migrations'),
  PORT: z.coerce.number().default(3333),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error('Invalid environment variable', parsedEnv.error.format())

  throw new Error('Invalid environment variable')
}

export const env = parsedEnv.data
