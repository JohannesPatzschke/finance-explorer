import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import produce from 'immer';
import { AccountObject, AccountType } from '../models/Account';

import useEncryptedStorage from './useEncryptedStorage';

type AccountStore = {
  accounts: Array<AccountType>;
  setAccounts: (accounts: Array<AccountType>) => void;
  resetAccounts: () => void;
  addAccount: (account: AccountType) => void;
  removeAccount: (accountId: string) => void;
};

const useAccountStore = create<AccountStore>()(
  persist(
    (set) => ({
      accounts: [],
      setAccounts: (accounts) => set(() => ({ accounts })),
      resetAccounts: () => set(() => ({ accounts: [] })),
      addAccount: (account) => {
        AccountObject.parse(account);

        return set(
          produce<AccountStore>((state) => {
            state.accounts.push(account);
          }),
        );
      },
      removeAccount: (accountId) =>
        set(
          produce<AccountStore>((state) => {
            const index = state.accounts.findIndex((account) => account.id === accountId);

            if (index !== -1) state.accounts.splice(index, 1);
          }),
        ),
    }),
    {
      name: 'accounts',
      storage: createJSONStorage(() => {
        const encryptedStorage = useEncryptedStorage.getState().storage;

        if (!encryptedStorage) {
          throw new Error('No storage');
        }

        return encryptedStorage;
      }),
      partialize: (state) => ({ accounts: state.accounts }),
    },
  ),
);

export default useAccountStore;
