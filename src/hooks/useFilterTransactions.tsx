import dayjs from 'dayjs';
import { findLastIndex } from 'lodash';
import { DateFilterType, CategoryFilterMapType } from '@models/Filters';
import { TransactionType } from '@models/Transaction';

function filterByCategory(
  transactions: Array<TransactionType>,
  categoryMap: CategoryFilterMapType,
) {
  return transactions.filter(({ categoryId, groupId }) => {
    if (!categoryId || !groupId) {
      return categoryMap.__UNCATEGORIZED__ !== false;
    }

    if (categoryId in categoryMap) {
      const filter: boolean | Array<string> = categoryMap[categoryId];

      return typeof filter === 'boolean' ? filter : filter.includes(groupId);
    }

    return true;
  });
}

const useFilterTransactions = (
  transactions: Array<TransactionType>,
  filter: { start?: DateFilterType; end?: DateFilterType; categoryMap?: CategoryFilterMapType },
) => {
  const { start, end, categoryMap } = filter;

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

  if (categoryMap && Object.values(categoryMap).some((value) => value !== true)) {
    transactions = filterByCategory(transactions, categoryMap);
  }

  return transactions;
};

export default useFilterTransactions;
