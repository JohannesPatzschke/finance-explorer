import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import produce from 'immer';
import { AccountObject, AccountType } from '../models/Account';

import useEncryptedStorage from './useEncryptedStorage';

interface AccountStore {
  accounts: Array<AccountType>;
  addAccount: (account: AccountType) => void;
}

const useAccountStore = create<AccountStore>()(
  persist(
    (set) => ({
      accounts: [],
      addAccount: (account) => {
        AccountObject.parse(account);

        return set(
          produce((state) => {
            state.accounts.push(account);
          }),
        );
      },
    }),
    {
      name: 'accounts',
      storage: createJSONStorage(() => useEncryptedStorage.getState().storage),
      partialize: (state) => ({ accounts: state.accounts }),
    },
  ),
);

export default useAccountStore;
