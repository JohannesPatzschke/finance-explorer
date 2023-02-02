import React from 'react';
import { SimpleGrid, Heading } from '@chakra-ui/react';

import AccountCard from '../components/display/AccountCard';
import AddAccountCard from '../components/display/AddAccountCard';

import useAccountStore from '../hooks/useAccounts';

const Accounts = () => {
  const accounts = useAccountStore((state) => state.accounts);

  return (
    <>
      <Heading size="lg">Accounts</Heading>
      <br />
      <SimpleGrid columns={{ lg: 2, xl: 3 }} spacing={4}>
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
        <AddAccountCard />
      </SimpleGrid>
    </>
  );
};

export default Accounts;
