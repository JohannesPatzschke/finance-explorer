import { z } from 'zod';

export const AccountObject = z.object({
  id: z.string(),
  bank: z.string(),
  owner: z.string(),
  number: z.string(),
  type: z.string(),
  transactionCount: z.number(),
  from: z.string().datetime(),
  to: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export type AccountType = z.infer<typeof AccountObject>;
