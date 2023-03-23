import { z } from 'zod'

export const UserRequestBodySchema = z.object({
  name: z.string(),
  email: z.string().email('Email inválido!'),
})

export const UserIdSchema = z.object({
  id: z.string().uuid('Formato inválido do ID'),
})
