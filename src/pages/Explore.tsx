import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { groupBy } from 'lodash';
import {
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  HStack,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { PieChart, Pie, Legend, Tooltip } from 'recharts';
import TransactionFilter from '@components/forms/TransactionFilter';
import useFilteredTransactions from '@hooks/useFilteredTransactions';
import useCategories from '@hooks/useCategories';
import { TransactionType } from '@models/Transaction';
import { toCurrency } from '@utils/currency';

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

const DAYS_PER_MONTH = 30.4375;

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

  const diffDays = dayjs
    .unix(transactions[0].timestamp)
    .diff(dayjs.unix(transactions[transactions.length - 1].timestamp), 'days');

  const income = useMemo(
    () => transactions.reduce((sum, { amount }) => (amount >= 0 ? sum + amount : sum), 0),
    [transactions],
  );
  const incomePerMonth = (income / diffDays) * DAYS_PER_MONTH;

  const outcome = useMemo(
    () => transactions.reduce((sum, { amount }) => (amount < 0 ? sum + amount : sum), 0),
    [transactions],
  );
  const outcomePerMonth = (outcome / diffDays) * DAYS_PER_MONTH;

  const bilance = income + outcome;
  const bilancePerMonth = (bilance / diffDays) * DAYS_PER_MONTH;

  return (
    <>
      <Heading size="lg">Explore</Heading>
      <br />
      <TransactionFilter />
      <br />
      <HStack>
        <Stat>
          <StatLabel>Income</StatLabel>
          <StatNumber>{toCurrency(income)} €</StatNumber>
          <StatHelpText>
            <StatArrow type={incomePerMonth > 0 ? 'increase' : 'decrease'} />ø per month{' '}
            {toCurrency(incomePerMonth)} €
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Outcome</StatLabel>
          <StatNumber>{toCurrency(outcome)} €</StatNumber>
          <StatHelpText>
            <StatArrow type={outcomePerMonth > 0 ? 'increase' : 'decrease'} />ø per month{' '}
            {toCurrency(outcomePerMonth)} €
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Bilance</StatLabel>
          <StatNumber color={bilance >= 0 ? 'green.300' : 'red.300'}>
            {toCurrency(bilance)} €
          </StatNumber>
          <StatHelpText>
            <StatArrow type={bilancePerMonth > 0 ? 'increase' : 'decrease'} />ø per month{' '}
            {toCurrency(bilancePerMonth)} €
          </StatHelpText>
        </Stat>
      </HStack>
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
    </>
  );
};

export default Explore;
