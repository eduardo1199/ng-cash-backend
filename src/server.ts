import fastify from 'fastify'

import { knex } from './database'

export const app = fastify({
  logger: true,
})

app.get('/hello', async (request, reply) => {
  return reply.status(200).send('hello word')
})

app.listen({ port: 3333 }, () => {
  console.log('server is running on port 3333')
})
