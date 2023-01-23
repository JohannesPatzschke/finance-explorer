import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import produce from 'immer';
import { TransactionObjects, TransactionType } from '../models/Transaction';

import useEncryptedStorage from './useEncryptedStorage';

type TransactionsStore = {
  transactions: Array<TransactionType>;
  addTransactions: (transactions: Array<TransactionType>) => void;
};

const useTransactionsStore = create<TransactionsStore>()(
  persist(
    (set) => ({
      transactions: [],
      addTransactions: (transactions) => {
        TransactionObjects.parse(transactions);

        return set(
          produce<TransactionsStore>((state) => {
            state.transactions.push(...transactions);
          }),
        );
      },
    }),
    {
      name: 'transactions',
      storage: createJSONStorage(() => {
        const encryptedStorage = useEncryptedStorage.getState().storage;

        if (!encryptedStorage) {
          throw new Error('No storage');
        }

        return encryptedStorage;
      }),
      partialize: (state) => ({ transactions: state.transactions }),
    },
  ),
);

export default useTransactionsStore;
