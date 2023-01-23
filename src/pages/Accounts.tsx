import React from 'react';
import dayjs from 'dayjs';
import { SimpleGrid, Heading, Text } from '@chakra-ui/react';

import AccountCard from '../components/display/AccountCard';
import AddAccountCard from '../components/display/AddAccountCard';

const accounts: Array<Account> = [
  {
    id: 'asda6a8sd6a8d7a87d6a5d76a5da7sd587a6d',
    bank: 'DKB',
    owner: 'Joe',
    number: 'DE26535652345235152345',
    type: 'Giro',
    from: dayjs().toISOString(),
    to: dayjs().toISOString(),
    createdAt: dayjs().toISOString(),
  },
];

const Accounts = () => {
  return (
    <>
      <Heading size="lg">Accounts</Heading>
      <br />
      <SimpleGrid minChildWidth={280} spacing={4}>
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
        <AddAccountCard />
      </SimpleGrid>
    </>
  );
};

export default Accounts;
