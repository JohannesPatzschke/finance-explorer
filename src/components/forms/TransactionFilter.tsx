import React from 'react';
import { Card, CardBody, Stack } from '@chakra-ui/react';
import CategoryFilterSelect from '@components/forms/CategoryFilterSelect';
import RangeFilter from '@components/forms/RangeFilter';
import { DateFilterType, CategoryFilterMapType } from '@models/Filters';

type TransactionFilterProps = {
  defaultFilter?: {
    start?: DateFilterType;
    end?: DateFilterType;
    categoryMap?: CategoryFilterMapType;
  };
  onRangeChange?: (filter: { start: DateFilterType; end: DateFilterType }) => void;
  onCategoryChange?: (categoryId: string, values: boolean | Array<string>) => void;
};

const TransactionFilter = ({
  defaultFilter,
  onRangeChange,
  onCategoryChange,
}: TransactionFilterProps) => {
  return (
    <Card variant="outline">
      <CardBody>
        <Stack spacing={8} direction="row">
          {onRangeChange && (
            <RangeFilter
              defaultFilter={{ start: defaultFilter?.start, end: defaultFilter?.end }}
              onChange={onRangeChange}
            />
          )}
          {onCategoryChange && (
            <CategoryFilterSelect
              categoryMap={defaultFilter?.categoryMap ?? {}}
              onChange={onCategoryChange}
            />
          )}
        </Stack>
      </CardBody>
    </Card>
  );
};

export default TransactionFilter;
