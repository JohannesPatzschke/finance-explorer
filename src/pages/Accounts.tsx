import React from 'react';
import { SimpleGrid, Heading } from '@chakra-ui/react';

import AccountGroupCard from '../components/display/AccountGroupCard';
import AddAccountCard from '../components/display/AddAccountCard';

import useAccountGroups from '../hooks/useAccountGroups';

const Accounts = () => {
  const accountGroups = useAccountGroups();

  return (
    <>
      <Heading size="lg">Accounts</Heading>
      <br />
      <SimpleGrid columns={{ lg: 2, xl: 3 }} spacing={4}>
        {accountGroups.map((group) => (
          <AccountGroupCard key={group.id} group={group} />
        ))}
        <AddAccountCard />
      </SimpleGrid>
    </>
  );
};

export default Accounts;
