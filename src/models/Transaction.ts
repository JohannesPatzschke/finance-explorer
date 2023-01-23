import { z } from 'zod';

export const TransactionObject = z.object({
  id: z.string(),
  accountId: z.string(),
  text: z.string(),
  client: z.string(),
  note: z.string(),
  amount: z.number(),
  timestamp: z.string().datetime(),
});

export type TransactionType = z.infer<typeof TransactionObject>;
