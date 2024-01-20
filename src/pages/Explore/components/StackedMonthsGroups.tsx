import React from 'react';
import dayjs from 'dayjs';
import Color from 'color';
import { sortBy } from 'lodash';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from 'recharts';
import useFilteredTransactions from '@hooks/useFilteredTransactions';
import useBackgroundColor from '@hooks/useBackgroundColor';
import { TransactionType } from '@models/Transaction';
import { toCurrency } from '@utils/currency';
import { GroupType, CategoryType } from '@models/Category';

type MonthGroupMap = Record<
  string,
  {
    key: string;
    name: string;
    timestamp: number;
  } & { [key: string]: number }
>;

type StackedMonthsGroupsProps = {
  category: CategoryType;
};

function calculateData(transactions: Array<TransactionType>, groups: Array<GroupType>) {
  const monthMap = transactions.reduce<MonthGroupMap>((map, transaction) => {
    const { timestamp, groupId = '-', amount } = transaction;
    const monthKey = dayjs.unix(timestamp).format('YYYY-MM');
    const name = dayjs.unix(timestamp).format('MMM YY');

    map[monthKey] = map[monthKey] ?? {
      key: monthKey,
      name,
      timestamp,
    };

    if (amount < 0) {
      const groupName = groups.find(({ id }) => id === groupId)?.name ?? groupId;

      map[monthKey][groupName] = (map[monthKey][groupName] ?? 0) + amount * -1;
    }

    return map;
  }, {});

  return sortBy(Object.values(monthMap), 'timestamp');
}

const StackedMonthsGroups = ({ category }: StackedMonthsGroupsProps) => {
  const bgColor = useBackgroundColor();
  const transactions = useFilteredTransactions();
  const { groups = [], fill } = category;

  const calcData = calculateData(transactions, groups);

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
        <Tooltip
          formatter={(value) => (typeof value === 'number' ? toCurrency(value) : value)}
          contentStyle={{ backgroundColor: bgColor }}
        />
        {groups.map(({ id, name }, index) => (
          <Bar
            key={id}
            dataKey={name}
            stackId="a"
            fill={Color(fill)
              .lighten(0.1 * index)
              .hex()}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedMonthsGroups;
