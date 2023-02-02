import React from 'react';
import { Card, CardBody, Stack } from '@chakra-ui/react';
import CategoryFilterSelect from '@components/forms/CategoryFilterSelect';
import RangeFilter from '@components/forms/RangeFilter';

const TransactionFilter = () => {
  return (
    <Card variant="outline">
      <CardBody>
        <Stack spacing={8} direction="row">
          <RangeFilter />

          <CategoryFilterSelect />
        </Stack>
      </CardBody>
    </Card>
  );
};

export default TransactionFilter;
