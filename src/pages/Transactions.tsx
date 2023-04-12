import React, { useMemo } from 'react';
import {
  Heading,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
  Button,
  Box,
  Flex,
} from '@chakra-ui/react';
import TransactionsTable from '../components/display/TransactionsTable';
import TransactionFilter from '@components/forms/TransactionFilter';
import useTransactionsStore from '../hooks/useTransactions';
import { TransactionType } from '../models/Transaction';
import useFilteredTransactions from '@hooks/useFilteredTransactions';

function groupTransactions(transactions: Array<TransactionType>) {
  const categorized: Array<TransactionType> = [];
  const suggestions: Array<TransactionType> = [];
  const uncategorized: Array<TransactionType> = [];

  transactions.forEach((transaction) => {
    if (transaction.categoryId) {
      categorized.push(transaction);
    } else if (transaction.suggestion) {
      suggestions.push(transaction);
    } else {
      uncategorized.push(transaction);
    }
  });

  return { categorized, suggestions, uncategorized };
}

const Transactions = () => {
  const transactions = useTransactionsStore((state) => state.transactions);
  const acceptSuggestions = useTransactionsStore((state) => state.acceptSuggestions);

  const { categorized, suggestions, uncategorized } = useMemo(
    () => groupTransactions(transactions),
    [transactions],
  );

  return (
    <>
      <Heading size="lg">Transactions</Heading>
      <br />
      <TransactionFilter />
      <br />
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>
            Categorized{' '}
            <Badge ml="1" colorScheme="teal">
              {categorized.length}
            </Badge>
          </Tab>
          <Tab>
            Suggestions
            <Badge ml="1" colorScheme="yellow">
              {suggestions.length}
            </Badge>
          </Tab>
          <Tab>
            Uncategorized
            <Badge ml="1" colorScheme="red">
              {uncategorized.length}
            </Badge>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TransactionsTable transactions={categorized} />
          </TabPanel>
          <TabPanel>
            {suggestions.length > 0 && (
              <Alert status="warning" mb={5}>
                <AlertIcon />
                You can accept all suggestions at once
                <Button
                  colorScheme="yellow"
                  variant="ghost"
                  onClick={() => acceptSuggestions(suggestions.map(({ id }) => id))}
                >
                  Accept all
                </Button>
              </Alert>
            )}

            <TransactionsTable transactions={suggestions} />
          </TabPanel>
          <TabPanel>
            <TransactionsTable transactions={uncategorized} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default Transactions;
