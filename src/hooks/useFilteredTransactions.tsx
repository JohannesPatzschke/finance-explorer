import dayjs from 'dayjs';
import { findLastIndex } from 'lodash';
import { CategoryFilterMapType } from '@models/Filters';
import { TransactionType } from '@models/Transaction';
import React, { useMemo } from 'react';
import { shallow } from 'zustand/shallow';
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
  const [start, end, categoryMap] = useFilters(
    (state) => [state.start, state.end, state.categoryMap],
    shallow,
  );

  let startIndex = null;
  let endIndex = null;

  if (start) {
    const startDate = dayjs(start).startOf('day');
    const index = findLastIndex(transactions, ({ timestamp }) =>
      dayjs.unix(timestamp).endOf('day').isAfter(startDate),
    );

    if (index !== -1) {
      endIndex = index;
    }
  }

  if (end) {
    const endDate = dayjs(end).endOf('day');
    const index = transactions.findIndex(({ timestamp }) =>
      dayjs.unix(timestamp).startOf('day').isBefore(endDate),
    );

    if (index !== -1) {
      startIndex = index;
    }
  }

  if (startIndex !== null || endIndex !== null) {
    transactions = transactions.slice(
      startIndex ?? 0,
      endIndex !== null ? endIndex + 1 : undefined,
    );
  }

  if (Object.values(categoryMap).some((value) => value !== true)) {
    transactions = filterByCategory(transactions, categoryMap);
  }

  return transactions;
};

export default useFilteredTransactions;
