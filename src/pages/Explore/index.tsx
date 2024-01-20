import React, { useState } from 'react';
import { Heading } from '@chakra-ui/react';
import { CategoryType } from '@models/Category';
import { DateFilterType } from '@models/Filters';
import TransactionFilter from '@components/forms/TransactionFilter';
import CategorySelect from '@components/inputs/CategorySelect';
import Stats from './components/Stats';
import Doughnuts from './components/Doughnuts';
import StackedMonths from './components/StackedMonths';
import StackedMonthsGroups from './components/StackedMonthsGroups';
import useFilters from '@hooks/useFilters';
import { shallow } from 'zustand/shallow';

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [start = null, end = null, categoryMap, setRange, setCategory] = useFilters(
    (state) => [state.start, state.end, state.categoryMap, state.setRange, state.setCategory],
    shallow,
  );

  const onRangeChange = (filter: { start: DateFilterType; end: DateFilterType }) => {
    setRange(filter);
  };

  const onCategoryChange = (categoryId: string, values: boolean | Array<string>) => {
    setCategory(categoryId, values);
  };

  return (
    <>
      <Heading size="lg">Explore</Heading>
      <br />
      <TransactionFilter
        defaultFilter={{
          start,
          end,
          categoryMap,
        }}
        onRangeChange={onRangeChange}
        onCategoryChange={onCategoryChange}
      />
      <br />
      <Stats start={start} end={end} />
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
