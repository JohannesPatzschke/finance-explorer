import { z } from 'zod';
import { AccountObjects } from '@models/Account';
import { CategoryObjects } from '@models/Category';
import { TransactionObjects } from '@models/Transaction';

export const BackupObject = z.object({
  accounts: AccountObjects,
  categories: CategoryObjects,
  transactions: TransactionObjects,
});

export type BackupType = z.infer<typeof BackupObject>;
