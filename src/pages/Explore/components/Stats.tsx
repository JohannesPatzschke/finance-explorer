import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { Stat, StatLabel, StatNumber, HStack, StatHelpText, StatArrow } from '@chakra-ui/react';
import useFilteredTransactions from '@hooks/useFilteredTransactions';
import { toCurrency } from '@utils/currency';

const DAYS_PER_MONTH = 30.4375;

const Stats = () => {
  const transactions = useFilteredTransactions();

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
  );
};

export default Stats;
