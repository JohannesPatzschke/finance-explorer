import { groupBy, minBy, maxBy } from 'lodash';
import { AccountType } from '../models/Account';
import useAccountStore from './useAccounts';

export type AccountGroupType = AccountType & {
  accounts: Array<AccountType>;
};

const useAccountGroups = () => {
  const accounts = useAccountStore((state) => state.accounts);
  const groups = groupBy(accounts, (account) => account.number);

  const accountGroups: Array<AccountGroupType> = Object.entries(groups).map(
    ([number, accounts]) => ({
      ...accounts[0],
      id: number,
      transactionCount: accounts.reduce((acc, account) => acc + account.transactionCount, 0),
      from: minBy(accounts, (account) => account.from)?.from ?? 0,
      to: maxBy(accounts, (account) => account.to)?.to ?? 0,
      createdAt: minBy(accounts, (account) => account.createdAt)?.createdAt ?? 0,
      updatedAt:
        maxBy(accounts, (account) => account.updatedAt ?? account.createdAt)?.createdAt ?? 0,
      accounts,
    }),
  );

  return accountGroups;
};

export default useAccountGroups;
