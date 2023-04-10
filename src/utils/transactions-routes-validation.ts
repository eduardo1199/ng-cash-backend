import { z } from 'zod'

export const TransactionRequestSchema = z
  .object({
    amount: z.number(),
    type: z.enum(['income', 'outcome']),
    userId: z.string().uuid(),
    userDestinationId: z.string().uuid().optional(),
    description: z.string(),
    category: z.string(),
  })
  .refine((data) => data.userId !== data.userDestinationId)

export const TransactionRequestSchemaId = z.object({
  id: z.string().uuid(),
})
