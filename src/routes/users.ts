import { FastifyInstance } from 'fastify'

import crypto from 'node:crypto'

import { z } from 'zod'

import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', async (request, reply) => {
    const { name, email }: any = request.body

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
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
      })

      const response = await knex('users')
        .insert({
          id: crypto.randomUUID(),
          name,
          email,
          session_id: sessionId,
        })
        .returning('id')

      await knex('transactions').insert({
        id: crypto.randomUUID(),
        amount: 100,
        created_at: new Date(),
        type: 'income',
        user_id: response[0].id,
      })

      return reply.status(201).send({ message: 'Success created user!' })
    } else {
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
      })

      await knex('users')
        .where({ id: user.id })
        .update({ session_id: sessionId })

      return reply.status(200).send()
    }
  })

  app.delete('/users/:id', async (request, reply) => {
    const getUserIdSchema = z.object({
      id: z.string().uuid('Formato inválido do ID'),
    })

    const sessionId = request.cookies.sessionId
    const { id } = getUserIdSchema.parse(request.params)

    if (!sessionId) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    await knex('users').where({ id }).del()

    return reply.status(200).send({ message: 'Deleted!' })
  })
}
