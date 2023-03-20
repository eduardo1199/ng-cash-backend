import fastify from 'fastify'

import cookies from '@fastify/cookie'
import cors from '@fastify/cors'
import fastifySession from '@fastify/session'

import { usersRoutes } from './routes/users'
import { transactionsRoutes } from './routes/transactions'

export const app = fastify({
  logger: true,
})

app.register(cookies)
app.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true,
})

app.register(usersRoutes)
app.register(transactionsRoutes)
