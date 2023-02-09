import React from 'react';
import { groupBy } from 'lodash';
import { PieChart, Pie, Legend, ResponsiveContainer } from 'recharts';
import useFilteredTransactions from '@hooks/useFilteredTransactions';
import useCategories from '@hooks/useCategories';
import { TransactionType } from '@models/Transaction';
import { toCurrency } from '@utils/currency';
import { CategoryType } from '@models/Category';
import COLOR_PALETTE from '@constants/colorPalette.json';

function calculatePieData(
  transactions: Array<TransactionType>,
  categories: Array<CategoryType & { fill: string }>,
) {
  const categoryGroups = groupBy(transactions, ({ categoryId }) => categoryId ?? 'Uncategorized');

  return Object.entries(categoryGroups).map(([categoryId, values]) => {
    const category =
      categoryId === 'Uncategorized'
        ? { name: categoryId, fill: '#CBD5E0' }
        : categories.find(({ id }) => id === categoryId) ?? { name: categoryId, fill: '#CBD5E0' };
    const value = values.reduce((sum, { amount }) => sum + amount, 0);

    return {
      name: category.name,
      value: Math.abs(Math.round(value * 100) / 100),
      fill: category.fill,
    };
  });
}

const Doughnuts = () => {
  const transactions = useFilteredTransactions();
  const categories = useCategories((state) => state.categories).map((category, index) => ({
    ...category,
    fill: COLOR_PALETTE[index % COLOR_PALETTE.length],
  }));

  const legendPayload = categories.map(({ id, name, fill }) => ({
    id,
    value: name,
    type: 'square' as 'square',
    color: fill,
  }));

  const incomePieData = calculatePieData(
    transactions.filter(({ amount }) => amount >= 0),
    categories,
  );
  const outcomePieData = calculatePieData(
    transactions.filter(({ amount }) => amount < 0),
    categories,
  );

  return (
    <ResponsiveContainer height={400}>
      <PieChart>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={incomePieData}
          cx="20%"
          cy="40%"
          outerRadius={100}
          innerRadius={40}
          paddingAngle={5}
          fill="#8884d8"
          label={({ value, x, y, fill, textAnchor }) => (
            <text x={x} y={y} fill={fill} textAnchor={textAnchor}>
              {toCurrency(value)}
            </text>
          )}
        />
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={outcomePieData}
          cx="60%"
          cy="40%"
          outerRadius={100}
          innerRadius={40}
          paddingAngle={5}
          fill="#8884d8"
          label={({ value, x, y, fill, textAnchor }) => (
            <text x={x} y={y} fill={fill} textAnchor={textAnchor}>
              {toCurrency(value)}
            </text>
          )}
        />
        <Legend
          verticalAlign="top"
          height={36}
          layout="vertical"
          align="right"
          payload={legendPayload}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Doughnuts;
