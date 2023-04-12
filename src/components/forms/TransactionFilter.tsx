import React from 'react';
import { Card, CardBody, Stack } from '@chakra-ui/react';
import CategoryFilterSelect from '@components/forms/CategoryFilterSelect';
import RangeFilter, { RangeFilterOutput } from '@components/forms/RangeFilter';
import useFilters from '@hooks/useFilters';
import { shallow } from 'zustand/shallow';

type TransactionFilterProps = {
  onChange?: (filter: any) => void;
};

const TransactionFilter = ({ onChange }: TransactionFilterProps) => {
  const [start = null, end = null, categoryMap, setRange, setCategory] = useFilters(
    (state) => [state.start, state.end, state.categoryMap, state.setRange, state.setCategory],
    shallow,
  );

  const onRangeChange = (filter: RangeFilterOutput) => {
    setRange(filter);
  };

  const onCategoryChange = (categoryId: string, values: boolean | Array<string>) => {
    setCategory(categoryId, values);
  };

  return (
    <Card variant="outline">
      <CardBody>
        <Stack spacing={8} direction="row">
          <RangeFilter defaultFilter={{ start, end }} onChange={onRangeChange} />
          <CategoryFilterSelect categoryMap={categoryMap} onChange={onCategoryChange} />
        </Stack>
      </CardBody>
    </Card>
  );
};

export default TransactionFilter;
