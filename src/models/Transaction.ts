import { z } from 'zod';

export const SuggestionObject = z.object({
  categoryId: z.string(),
  groupId: z.string(),
});

export type SuggestionType = z.infer<typeof SuggestionObject>;

export const TransactionObject = z.object({
  id: z.string(),
  accountIds: z.string().array(),
  accountNumber: z.string(),
  text: z.string(),
  client: z.string(),
  note: z.string(),
  amount: z.number(),
  timestamp: z.number(),
  categoryId: z.string().optional(),
  groupId: z.string().optional(),
  suggestion: SuggestionObject.optional(),
});

export const TransactionObjects = z.array(TransactionObject);

export type TransactionType = z.infer<typeof TransactionObject>;
