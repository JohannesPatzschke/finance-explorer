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
import { PieChart, Pie, Legend, ResponsiveContainer } from 'recharts';
import TransactionFilter from '@components/forms/TransactionFilter';
import useFilteredTransactions from '@hooks/useFilteredTransactions';
import useCategories from '@hooks/useCategories';
import { TransactionType } from '@models/Transaction';
import { toCurrency } from '@utils/currency';
import { CategoryType } from '@models/Category';

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

const Explore = () => {
  const transactions = useFilteredTransactions();
  const categories = useCategories((state) => state.categories).map((category, index) => ({
    ...category,
    fill: COLOR_PALETTE[index],
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

  console.log(transactions);

  const diffDays = dayjs
    .unix(transactions[0]?.timestamp)
    .diff(dayjs.unix(transactions[transactions.length - 1]?.timestamp), 'days');

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
          <StatHelpText>ø per month {toCurrency(incomePerMonth)} €</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Outcome</StatLabel>
          <StatNumber>{toCurrency(outcome)} €</StatNumber>
          <StatHelpText>ø per month {toCurrency(outcomePerMonth)} €</StatHelpText>
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
      <br />
      <ResponsiveContainer height={500}>
        <PieChart height={500}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={incomePieData}
            cx="20%"
            cy="25%"
            outerRadius={100}
            innerRadius={40}
            paddingAngle={5}
            fill="#8884d8"
            label={({ value, x, y, fill, textAnchor }) => (
              <text x={x} y={y} fill={fill} textAnchor={textAnchor}>
                {toCurrency(value)} €
              </text>
            )}
          />
          <text x={225} y={130} fill="#ffffff" textAnchor="middle" dominantBaseline="middle">
            Income
          </text>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={outcomePieData}
            cx="60%"
            cy="25%"
            outerRadius={100}
            innerRadius={40}
            paddingAngle={5}
            fill="#8884d8"
            label={({ value, x, y, fill, textAnchor }) => (
              <text x={x} y={y} fill={fill} textAnchor={textAnchor}>
                {toCurrency(value)} €
              </text>
            )}
          />
          <text x={670} y={130} fill="#ffffff" textAnchor="middle" dominantBaseline="middle">
            Outcome
          </text>
          <Legend
            verticalAlign="top"
            height={36}
            layout="vertical"
            align="right"
            payload={legendPayload}
          />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default Explore;
