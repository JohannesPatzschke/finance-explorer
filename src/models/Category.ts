import { z } from 'zod';

export const GroupObject = z.object({
  id: z.string(),
  name: z.string(),
  expressions: z.string().array(),
});

export const CategoryObject = z.object({
  id: z.string(),
  name: z.string(),
  groups: z.array(GroupObject),
});

export const CategoryObjects = z.array(CategoryObject);

export type CategoryType = z.infer<typeof CategoryObject>;
