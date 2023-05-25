import { FastifyRequest, FastifyReply } from 'fastify'
import { UserRequestBodySchema } from '../../../utils/user-routes-validation'

import { RegisterUserCase } from '../../../use-cases/register-user'
import { HasUserByEmailCase } from '../../../use-cases/has-user'
import { UpdateUserCase } from '../../../use-cases/update-user'

import crypto from 'node:crypto'
import { PrismaUserRepository } from '../../../repositories/prisma-user-repository'

export async function RegisterUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { name, email } = UserRequestBodySchema.parse(request.body)

  try {
    const userRepository = new PrismaUserRepository()
    const hasUserCase = new HasUserByEmailCase(userRepository)
    const registerUserCase = new RegisterUserCase(userRepository)
    const updateUserCase = new UpdateUserCase(userRepository)

    const hasUser = await hasUserCase.execute(email)

    const sessionId = crypto.randomUUID()

    if (hasUser) {
      const id = await registerUserCase.execute({ name, email })

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 1, // 1 dia
      })

      return reply.status(201).send({ id })
    } else {
      reply.cookie('sessionId', sessionId, {
        path: '/',
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 1, // 1 dias
      })

      const id = await updateUserCase.execute(email)

      return reply.status(200).send({ id })
    }
  } catch (error) {
    return reply.status(500).send({ message: error.message })
  }
}
