import { FastifyInstance } from 'fastify'

import crypto from 'node:crypto'

import { CheckSessionId } from '../middlewares/check-session'

import { knex } from '../database'
import {
  UserIdSchema,
  UserRequestBodySchema,
} from '../utils/user-routes-validation'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', async (request, reply) => {
    const { name, email } = UserRequestBodySchema.parse(request.body)

    const user = await knex('users')
      .select()
      .where({
        email,
      })
      .first()

    const sessionId = crypto.randomUUID()

    if (!user?.id) {
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 1, // 1 dia
      })

      const response = await knex('users')
        .insert({
          id: crypto.randomUUID(),
          name,
          email,
          session_id: sessionId,
        })
        .returning(['id', 'name'])

      await knex('transactions').insert({
        id: crypto.randomUUID(),
        amount: 100,
        created_at: new Date(),
        type: 'income',
        user_id: response[0].id,
        category: 'Entrada inicial',
        description: 'Primeiro depósito',
      })

      return reply.status(201).send({ id: response[0].id })
    } else {
      reply.cookie('sessionId', sessionId, {
        path: '/',
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 1, // 1 dias
      })

      const response = await knex('users')
        .where({ id: user.id })
        .update({ session_id: sessionId })
        .returning('id')

      return reply.status(200).send({ id: response[0].id })
    }
  })

  app.delete(
    '/users/:id',
    { preHandler: [CheckSessionId] },
    async (request, reply) => {
      const { id } = UserIdSchema.parse(request.params)

      await knex('users').where({ id }).del()

      return reply.status(200).send({ message: 'Deleted!' })
    },
  )

  app.get('/users', { preHandler: [CheckSessionId] }, async (request) => {
    const userAuth = await knex('users')
      .select('id')
      .where({ session_id: request.cookies.sessionId })

    const usersAll = await knex('users').select('*')

    const users = usersAll.filter((user) => user.id !== userAuth[0].id)

    return {
      users,
    }
  })
}
