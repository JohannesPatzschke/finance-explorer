import { create } from 'zustand';
import { orderBy } from 'lodash';
import { persist, createJSONStorage } from 'zustand/middleware';
import produce from 'immer';
import { TransactionObjects, TransactionType } from '../models/Transaction';
import { CategoryType } from '../models/Category';
import useCategories from './useCategories';
import useEncryptedStorage from './useEncryptedStorage';

type TransactionsStore = {
  transactions: Array<TransactionType>;
  setTransactions: (transactions: Array<TransactionType>) => void;
  resetTransactions: () => void;
  removeTransactionsByAccount: (accountId: string) => void;
  addTransactions: (transactions: Array<TransactionType>) => void;
  setCategory: (transactionId: string, categoryId: string, groupId: string) => void;
  addSuggestions: (category: CategoryType) => void;
  acceptSuggestion: (transactionId: string) => void;
  acceptSuggestions: (transactionIds: Array<string>) => void;
};

function processCategory(transaction: TransactionType, category: CategoryType) {
  if (
    transaction.categoryId ||
    (transaction.suggestion && transaction.suggestion.categoryId !== category.id)
  ) {
    return transaction;
  }

  const { text, client, note } = transaction;

  const searchString = [text, client, note].join(' ');

  for (const group of category.groups) {
    for (const expression of group.expressions) {
      const { value, isRegExp } = expression;

      if (
        (!isRegExp && searchString.includes(value)) ||
        (isRegExp && new RegExp(value).test(searchString))
      ) {
        transaction.suggestion = {
          categoryId: category.id,
          groupId: group.id,
        };

        return transaction;
      }
    }
  }

  return transaction;
}

function categorizeTransaction(transaction: TransactionType) {
  const categories = useCategories.getState().categories;

  let categorizedTransaction: TransactionType = transaction;

  for (const category of categories) {
    categorizedTransaction = processCategory(transaction, category);

    if (categorizedTransaction.categoryId) {
      return categorizedTransaction;
    }
  }

  return transaction;
}

const useTransactions = create<TransactionsStore>()(
  persist(
    (set) => ({
      transactions: [],
      setTransactions: (transactions) => set(() => ({ transactions })),
      resetTransactions: () => set(() => ({ transactions: [] })),
      removeTransactionsByAccount: (accountId) =>
        set((state) => ({
          transactions: state.transactions
            .map(({ accountIds, ...rest }) => ({
              ...rest,
              accountIds: accountIds.filter((id) => id !== accountId),
            }))
            .filter(({ accountIds }) => accountIds.length !== 0),
        })),
      addTransactions: (transactions) => {
        TransactionObjects.parse(transactions);

        const categorizedTransactions: Array<TransactionType> =
          transactions.map(categorizeTransaction);

        return set((state) => ({
          transactions: orderBy(
            state.transactions.concat(categorizedTransactions),
            'timestamp',
            'desc',
          ),
        }));
      },
      setCategory: (transactionId, categoryId, groupId) => {
        return set(
          produce<TransactionsStore>((state) => {
            const index = state.transactions.findIndex(({ id }) => id === transactionId);

            if (index !== -1) {
              state.transactions[index].categoryId = categoryId;
              state.transactions[index].groupId = groupId;

              delete state.transactions[index].suggestion;
            }
          }),
        );
      },
      addSuggestions: (category) => {
        return set(
          produce<TransactionsStore>((state) => {
            state.transactions = state.transactions.map((transaction) =>
              processCategory(transaction, category),
            );
          }),
        );
      },
      acceptSuggestion: (transactionId) => {
        return set(
          produce<TransactionsStore>((state) => {
            const index = state.transactions.findIndex(({ id }) => id === transactionId);

            if (index !== -1) {
              state.transactions[index].categoryId =
                state.transactions[index].suggestion?.categoryId;
              state.transactions[index].groupId = state.transactions[index].suggestion?.groupId;

              delete state.transactions[index].suggestion;
            }
          }),
        );
      },
      acceptSuggestions: (transactionIds) => {
        return set(
          produce<TransactionsStore>((state) => {
            state.transactions = state.transactions.map((transaction) => {
              if (transactionIds.includes(transaction.id)) {
                transaction.categoryId = transaction.suggestion?.categoryId;
                transaction.groupId = transaction.suggestion?.groupId;

                delete transaction.suggestion;
              }

              return transaction;
            });
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

export default useTransactions;
