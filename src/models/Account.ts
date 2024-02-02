import { z } from 'zod';

export const AccountObject = z.object({
  id: z.string(),
  bank: z.string(),
  owner: z.string(),
  number: z.string(),
  type: z.string(),
  transactionCount: z.number(),
  from: z.number(),
  to: z.number(),
  createdAt: z.number(),
  updatedAt: z.number().optional(),
});

export const AccountObjects = z.array(AccountObject);

export type AccountType = z.infer<typeof AccountObject>;
