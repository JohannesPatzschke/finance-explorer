import { shallow } from 'zustand/shallow';
import useFilters from './useFilters';
import useTransactions from './useTransactions';
import useFilterTransactions from './useFilterTransactions';

const useFilteredTransactions = () => {
  const transactions = useTransactions((state) => state.transactions);
  const [start, end, categoryMap] = useFilters(
    (state) => [state.start, state.end, state.categoryMap],
    shallow,
  );

  return useFilterTransactions(transactions, { start, end, categoryMap });
};

export default useFilteredTransactions;
