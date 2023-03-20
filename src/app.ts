import fastify from 'fastify'

import cookies from '@fastify/cookie'
import cors from '@fastify/cors'

import { usersRoutes } from './routes/users'
import { transactionsRoutes } from './routes/transactions'

export const app = fastify({
  logger: true,
})

app.register(cookies)
app.register(cors)

app.register(usersRoutes)
app.register(transactionsRoutes)
