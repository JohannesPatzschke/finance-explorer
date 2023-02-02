import { z } from 'zod';

export const CategoryFilterMapObject = z.record(
  z.string(),
  z.union([z.boolean(), z.string().array()]),
);

export type CategoryFilterMapType = z.infer<typeof CategoryFilterMapObject>;
