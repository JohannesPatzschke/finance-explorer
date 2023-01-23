import React, { useMemo } from 'react';
import { partition } from 'lodash';
import { Heading, Badge, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import TransactionsTable from '../components/display/TransactionsTable';

import useTransactionsStore from '../hooks/useTransactions';

const Transactions = () => {
  const transactions = useTransactionsStore((state) => state.transactions);

  const [categorized, uncategorized] = useMemo(
    () => partition(transactions, ({ category }) => !!category),
    [transactions],
  );

  return (
    <>
      <Heading size="lg">Transactions</Heading>
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
            Uncategorized
            <Badge ml="1" colorScheme="yellow">
              {uncategorized.length}
            </Badge>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TransactionsTable transactions={categorized} />
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
