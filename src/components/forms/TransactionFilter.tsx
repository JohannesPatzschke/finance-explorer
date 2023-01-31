import React from 'react';
import { Card, CardBody, HStack } from '@chakra-ui/react';
import CategoryFilterSelect from '@components/forms/CategoryFilterSelect';

const TransactionFilter = () => {
  return (
    <Card variant="outline">
      <CardBody>
        <HStack>
          <CategoryFilterSelect />
        </HStack>
      </CardBody>
    </Card>
  );
};

export default TransactionFilter;
