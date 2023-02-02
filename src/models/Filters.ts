import { z } from 'zod';

export const DateFilterObject = z.number().nullable().optional();

export type DateFilterType = z.infer<typeof DateFilterObject>;

export const CategoryFilterMapObject = z.record(
  z.string(),
  z.union([z.boolean(), z.string().array()]),
);

export type CategoryFilterMapType = z.infer<typeof CategoryFilterMapObject>;

export const FiltersObject = z.object({
  start: z.number().nullable().optional(),
  end: z.number().nullable().optional(),
  categoryMap: CategoryFilterMapObject,
});

export type FiltersType = z.infer<typeof FiltersObject>;
