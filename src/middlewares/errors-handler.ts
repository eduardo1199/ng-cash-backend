import { errorCodes, FastifyError, FastifyRequest, FastifyReply } from 'fastify'

import { z } from 'zod'

export async function ErrorsHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof errorCodes.FST_ERR_BAD_STATUS_CODE) {
    console.error(error)
    return reply.status(500).send({ error })
  }

  if (error instanceof z.ZodError) {
    const errorsZodResponse = error.issues.map((issue) => {
      return {
        message: issue.message,
        path: issue.path[0],
      }
    })

    console.error(errorsZodResponse)
    return reply.status(500).send({ errors: errorsZodResponse })
  }

  console.error(error)
  return reply.status(500).send({ error: 'Error interno do servidor!' })
}
