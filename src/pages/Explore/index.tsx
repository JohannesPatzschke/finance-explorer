import React, { useState } from 'react';
import { Heading } from '@chakra-ui/react';
import { CategoryType } from '@models/Category';
import TransactionFilter from '@components/forms/TransactionFilter';
import CategorySelect from '@components/inputs/CategorySelect';
import Stats from './components/Stats';
import Doughnuts from './components/Doughnuts';
import StackedMonths from './components/StackedMonths';
import StackedMonthsGroups from './components/StackedMonthsGroups';

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);

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
      <Heading as="h5" size="sm" mb={5}>
        By Category
      </Heading>
      <StackedMonths />
      <br />
      <Heading as="h5" size="sm" mb={5}>
        By Group
      </Heading>
      <CategorySelect onChange={setSelectedCategory} />
      <br />
      {selectedCategory && <StackedMonthsGroups category={selectedCategory} />}
    </>
  );
};

export default Explore;
