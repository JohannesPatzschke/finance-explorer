import { z } from 'zod';

export const TransactionObject = z.object({
  id: z.string(),
  accountIds: z.string().array(),
  accountNumber: z.string(),
  text: z.string(),
  client: z.string(),
  note: z.string(),
  amount: z.number(),
  timestamp: z.number(),
  category: z.string().optional(),
  group: z.string().optional(),
});

export const TransactionObjects = z.array(TransactionObject);

export type TransactionType = z.infer<typeof TransactionObject>;
