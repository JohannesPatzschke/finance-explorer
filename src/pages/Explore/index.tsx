import React from 'react';
import { Heading } from '@chakra-ui/react';
import TransactionFilter from '@components/forms/TransactionFilter';
import Stats from './components/Stats';
import Doughnuts from './components/Doughnuts';
import StackedMonths from './components/StackedMonths';

const Explore = () => {
  return (
    <>
      <Heading size="lg">Explore</Heading>
      <br />
      <TransactionFilter />
      <br />
      <Stats />
      <br />
      <br />
      <br />
      <Doughnuts />
      <StackedMonths />
    </>
  );
};

export default Explore;
