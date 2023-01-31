import React, { useMemo } from 'react';
import { groupBy } from 'lodash';
import { Heading, Stat, StatLabel, StatNumber, HStack } from '@chakra-ui/react';
import { PieChart, Pie, Legend, Tooltip, Label } from 'recharts';
import TransactionFilter from '@components/forms/TransactionFilter';
import useFilteredTransactions from '@hooks/useFilteredTransactions';
import useCategories from '@hooks/useCategories';
import { TransactionType } from '@models/Transaction';

const COLOR_PALETTE = [
  '#FC8181',
  '#F6AD55',
  '#F6E05E',
  '#68D391',
  '#4FD1C5',
  '#63B3ED',
  '#76E4F7',
  '#B794F4',
  '#F687B3',
];

function calculatePieData(transactions: Array<TransactionType>) {
  const categoryGroups = groupBy(transactions, ({ categoryId }) => categoryId ?? 'Uncategorized');

  return Object.entries(categoryGroups).map(([key, values], index) => {
    const category =
      key === 'Uncategorized' ? key : useCategories.getState().getCategoryName(key).category;
    const value = values.reduce((sum, { amount }) => sum + amount, 0);

    return {
      name: category,
      value: Math.abs(Math.round(value * 100) / 100),
      fill: COLOR_PALETTE[index],
    };
  });
}

const Explore = () => {
  const transactions = useFilteredTransactions();

  const pieData = calculatePieData(transactions);

  const income = useMemo(
    () => transactions.reduce((sum, { amount }) => (amount >= 0 ? sum + amount : sum), 0),
    [transactions],
  );

  const outcome = useMemo(
    () => transactions.reduce((sum, { amount }) => (amount < 0 ? sum + amount : sum), 0),
    [transactions],
  );

  return (
    <>
      <Heading size="lg">Explore</Heading>
      <br />
      <TransactionFilter />
      <br />

      <PieChart width={400} height={400}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={pieData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
      </PieChart>

      <HStack>
        <Stat>
          <StatLabel>Income</StatLabel>
          <StatNumber>{income.toFixed(2)} €</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Outcome</StatLabel>
          <StatNumber>{outcome.toFixed(2)} €</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Bilance</StatLabel>
          <StatNumber>{(income + outcome).toFixed(2)} €</StatNumber>
        </Stat>
      </HStack>
    </>
  );
};

export default Explore;
