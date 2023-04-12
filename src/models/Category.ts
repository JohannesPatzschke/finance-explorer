import { z } from 'zod';

export const ExpressionObject = z.object({
  id: z.string(),
  value: z.string(),
  isRegExp: z.boolean(),
  flags: z.string().optional(),
});

export type ExpressionType = z.infer<typeof ExpressionObject>;

export const GroupObject = z.object({
  id: z.string(),
  name: z.string(),
  expressions: z.array(ExpressionObject),
});

export type GroupType = z.infer<typeof GroupObject>;

export const CategoryObject = z.object({
  id: z.string(),
  name: z.string(),
  groups: z.array(GroupObject),
  fill: z.string().optional(),
});

export const CategoryObjects = z.array(CategoryObject);

export type CategoryType = z.infer<typeof CategoryObject>;
