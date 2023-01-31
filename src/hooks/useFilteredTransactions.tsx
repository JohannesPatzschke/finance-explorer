import { CategoryFilterMapType } from '@models/Filters';
import { TransactionType } from '@models/Transaction';
import React, { useMemo } from 'react';
import useFilters from './useFilters';
import useTransactions from './useTransactions';

function filterByCategory(
  transactions: Array<TransactionType>,
  categoryMap: CategoryFilterMapType,
) {
  return transactions.filter(({ categoryId, groupId }) => {
    if (!categoryId || !groupId) {
      return categoryMap.__UNCATEGORIZED__ !== false;
    }

    if (categoryId in categoryMap) {
      const filter = categoryMap[categoryId];

      return typeof filter === 'boolean' ? filter : filter.includes(groupId);
    }

    return true;
  });
}

const useFilteredTransactions = () => {
  let transactions = useTransactions((state) => state.transactions);
  const categoryMap = useFilters((state) => state.categoryMap);

  if (Object.values(categoryMap).some((value) => value !== true)) {
    transactions = filterByCategory(transactions, categoryMap);
  }

  return transactions;
};

export default useFilteredTransactions;
