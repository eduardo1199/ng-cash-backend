import { FastifyRequest, FastifyReply } from 'fastify'
import { UserRequestBodySchema } from '../../../utils/user-routes-validation'
import { registerServiceUser } from '../../../services/register-user'
import { hasUserServiceUser } from '../../../services/has-user'
import { updateUserService } from '../../../services/update-user'

import crypto from 'node:crypto'

export async function RegisterUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { name, email } = UserRequestBodySchema.parse(request.body)

  const hasUser = await hasUserServiceUser({ email })

  const sessionId = crypto.randomUUID()

  if (hasUser) {
    const id = await registerServiceUser({ name, email })

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

    const id = await updateUserService({ email })

    return reply.status(200).send({ id })
  }
}
