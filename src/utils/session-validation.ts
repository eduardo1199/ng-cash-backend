import { z } from 'zod'

export const SessionIdSchema = z.object({
  sessionId: z.string().uuid('Id de sessão inválido!'),
})
