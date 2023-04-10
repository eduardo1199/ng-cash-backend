import { FastifyInstance } from 'fastify'

import crypto from 'node:crypto'

import { z } from 'zod'
import { knex } from '../database'
import {
  TransactionRequestSchema,
  TransactionRequestSchemaId,
} from '../utils/transactions-routes-validation'
import { UserIdSchema } from '../utils/user-routes-validation'
import { CheckSessionId } from '../middlewares/check-session'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post(
    '/transactions/transfer',
    { preHandler: [CheckSessionId] },
    async (request, reply) => {
      const { amount, type, userId, userDestinationId, category, description } =
        TransactionRequestSchema.parse(request.body)

      const transaction = await knex('transactions')
        .insert({
          id: crypto.randomUUID(),
          amount,
          type,
          user_id: userId,
          category,
          description,
        })
        .returning('id')

      const transactionDestination = await knex('transactions')
        .insert({
          id: crypto.randomUUID(),
          amount,
          type: 'income',
          user_id: userDestinationId,
          category,
          description,
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
    },
  )

  app.post(
    '/transactions/deposit',
    { preHandler: [CheckSessionId] },
    async (request, reply) => {
      const { amount, type, userId, category, description } =
        TransactionRequestSchema.parse(request.body)

      await knex('transactions')
        .insert({
          id: crypto.randomUUID(),
          amount,
          type,
          user_id: userId,
          category,
          description,
        })
        .returning('id')

      return reply.status(201).send()
    },
  )

  app.get(
    '/transactions/:id',
    { preHandler: [CheckSessionId] },
    async (request, reply) => {
      const { id } = UserIdSchema.parse(request.params)

      const transactions = await knex('transactions')
        .where({ user_id: id })
        .select('*')

      return { transactions }
    },
  )

  app.get(
    '/transactions/transfer/:id',
    { preHandler: [CheckSessionId] },
    async (request, reply) => {
      const { id } = TransactionRequestSchemaId.parse(request.params)

      const transactionTransfer = await knex('transactions_users') // buscar transferencia relacionado ao usuario de destino
        .where({
          transaction_id: id,
        })
        .first()

      if (!transactionTransfer?.user_destiny_id) {
        return reply.status(400).send({
          message:
            'Essa transferência foi realizar por você! Selecione outra transferência para buscar mais informações.',
        })
      }

      const userOfTransfer = await knex('users') // buscar dados do usuario que recebeu a transferencia
        .where({
          id: transactionTransfer.user_destiny_id,
        })
        .first()

      const transactionData = await knex('transactions') // buscar dados da transferencia selecionada
        .where({
          user_id: transactionTransfer.user_id,
          id: transactionTransfer.transaction_id,
        })
        .first()

      const transaction = {
        amount: transactionData.amount,
        createdAt: transactionData.created_at,
        type: transactionData.type,
        category: transactionData.category,
        description: transactionData.description,
        name: userOfTransfer.name,
      }

      return { transaction }
    },
  )

  app.delete(
    '/transactions/:id',
    { preHandler: [CheckSessionId] },
    async (request, reply) => {
      const getTransactionIdSchema = z.object({
        id: z.string().uuid('Formato inválido do ID'),
      })

      const { id } = getTransactionIdSchema.parse(request.params)

      await knex('transactions').where({ id }).del()

      return reply.status(200).send({ message: 'Deleted!' })
    },
  )
}
