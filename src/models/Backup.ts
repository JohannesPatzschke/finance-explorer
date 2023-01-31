import { z } from 'zod';
import { AccountObjects } from '@models/Account';
import { CategoryObjects } from '@models/Category';
import { TransactionObjects } from '@models/Transaction';
import { CategoryFilterMapObject } from '@models/Filters';

export const BackupObject = z.object({
  accounts: AccountObjects,
  categories: CategoryObjects,
  transactions: TransactionObjects,
  filters: z.object({
    categoryMap: CategoryFilterMapObject,
  }),
});

export type BackupType = z.infer<typeof BackupObject>;
