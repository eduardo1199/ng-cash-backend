import fastify, { errorCodes } from 'fastify'
import { z } from 'zod'
import cookies from '@fastify/cookie'
import cors from '@fastify/cors'

import { usersRoutes } from './routes/users'
import { transactionsRoutes } from './routes/transactions'
import { env } from './env/validate'

import { ErrorsHandler } from './middlewares/errors-handler'

export const app = fastify({
  logger: true,
})

app.register(usersRoutes)
app.register(transactionsRoutes)

app.register(cookies)
app.register(cors, {
  origin: env.NODE_ENV === 'production' ? undefined : env.CLIENT_URL,
  credentials: env.NODE_ENV === 'production' ? undefined : true,
})

app.setErrorHandler(ErrorsHandler)
