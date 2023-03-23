import { z } from 'zod'

export const TransactionRequestSchema = z
  .object({
    amount: z.number(),
    type: z.enum(['income', 'outcome']),
    userId: z.string().uuid(),
    userDestinationId: z.string().uuid(),
  })
  .refine((data) => data.userId !== data.userDestinationId)