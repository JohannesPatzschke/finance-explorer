import React from 'react';
import dayjs from 'dayjs';
import { sortBy } from 'lodash';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from 'recharts';
import useFilteredTransactions from '@hooks/useFilteredTransactions';
import useCategories from '@hooks/useCategories';
import { TransactionType } from '@models/Transaction';
import { toCurrency } from '@utils/currency';
import { CategoryType } from '@models/Category';
import COLOR_PALETTE from '@constants/colorPalette.json';

type MonthCategoryMap = Record<
  string,
  {
    key: string;
    name: string;
    timestamp: number;
  } & { [key: string]: number }
>;

function calculateData(transactions: Array<TransactionType>, categories: Array<CategoryType>) {
  const monthMap = transactions.reduce<MonthCategoryMap>((map, transaction) => {
    const { timestamp, categoryId = 'Uncategorized', amount } = transaction;
    const monthKey = dayjs.unix(timestamp).format('YYYY-MM');
    const name = dayjs.unix(timestamp).format('MMM YY');

    map[monthKey] = map[monthKey] ?? {
      key: monthKey,
      name,
      timestamp,
    };

    if (amount < 0) {
      const categoryName = categories.find(({ id }) => id === categoryId)?.name ?? categoryId;

      map[monthKey][categoryName] = (map[monthKey][categoryName] ?? 0) + amount * -1;
    }

    return map;
  }, {});

  return sortBy(Object.values(monthMap), 'timestamp');
}

const StackedMonths = () => {
  const transactions = useFilteredTransactions();
  const categories = useCategories((state) => state.categories).concat([
    { id: 'Uncategorized', name: 'Uncategorized', groups: [] },
  ]);

  const calcData = calculateData(transactions, categories);

  return (
    <ResponsiveContainer height={500}>
      <BarChart
        width={500}
        height={300}
        data={calcData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => (typeof value === 'number' ? toCurrency(value) : value)} />
        {categories.map(({ id, name }, index) => (
          <Bar
            key={id}
            dataKey={name}
            stackId="a"
            fill={COLOR_PALETTE[index % COLOR_PALETTE.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedMonths;
