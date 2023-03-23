import { FastifyInstance } from 'fastify'

import { SessionIdSchema } from '../utils/session-validation'

import crypto from 'node:crypto'

import { z } from 'zod'
import { knex } from '../database'
import { TransactionRequestSchema } from '../utils/transactions-routes-validation'
import { UserIdSchema } from '../utils/user-routes-validation'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/transactions', async (request, reply) => {
    const { sessionId } = SessionIdSchema.parse(request.cookies)

    if (!sessionId) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    const { amount, type, userId, userDestinationId } =
      TransactionRequestSchema.parse(request.body)

    const transaction = await knex('transactions')
      .insert({
        id: crypto.randomUUID(),
        amount,
        type,
        user_id: userId,
      })
      .returning('id')

    const transactionDestination = await knex('transactions')
      .insert({
        id: crypto.randomUUID(),
        amount,
        type: type === 'income' ? 'outcome' : 'income',
        user_id: userDestinationId,
      })
      .returning('id')

    await knex('transactions_users').insert({
      id: crypto.randomUUID(),
      user_id: userId,
      user_destiny_id: userDestinationId,
      transaction_id: transaction[0].id,
    })

    await knex('transactions_users').insert({
      id: crypto.randomUUID(),
      user_id: userDestinationId,
      user_destiny_id: userId,
      transaction_id: transactionDestination[0].id,
    })

    return reply.status(201).send()
  })

  app.get('/transactions/:id', async (request, reply) => {
    const { sessionId } = SessionIdSchema.parse(request.cookies)

    if (!sessionId) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    const { id } = UserIdSchema.parse(request.params)

    const transactions = await knex('transactions')
      .where({ user_id: id })
      .select('*')

    return { transactions }
  })

  app.delete('/transactions/:id', async (request, reply) => {
    const getTransactionIdSchema = z.object({
      id: z.string().uuid('Formato inválido do ID'),
    })

    const { sessionId } = SessionIdSchema.parse(request.cookies)

    if (!sessionId) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    const { id } = getTransactionIdSchema.parse(request.params)

    await knex('transactions').where({ id }).del()

    return reply.status(200).send({ message: 'Deleted!' })
  })
}
