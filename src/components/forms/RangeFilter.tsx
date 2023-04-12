import React, { forwardRef, useState, useCallback } from 'react';
import { Button } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';

export type RangeFilterOutput = {
  start: Date | null;
  end: Date | null;
};

export type RangeFilterInput = {
  start?: Date | number | null;
  end?: Date | number | null;
};

type RangeFilterProps = {
  defaultFilter?: RangeFilterInput;
  onChange?: (filter: RangeFilterOutput) => void;
};

function normalizeInput(input: RangeFilterInput): RangeFilterOutput {
  return {
    start: typeof input.start === 'number' ? new Date(input.start) : input.start ?? null,
    end: typeof input.end === 'number' ? new Date(input.end) : input.end ?? null,
  };
}

const RangeFilter = ({
  defaultFilter = { start: null, end: null },
  onChange,
}: RangeFilterProps) => {
  const [{ start, end }, setFilter] = useState<RangeFilterOutput>(normalizeInput(defaultFilter));

  const setStart = useCallback(
    (date: Date | null) => {
      setFilter((filter) => ({ ...filter, start: date }));
      onChange?.({ start: date, end });
    },
    [onChange, end],
  );

  const setEnd = useCallback(
    (date: Date | null) => {
      setFilter((filter) => ({ ...filter, end: date }));
      onChange?.({ start, end: date });
    },
    [onChange, start],
  );

  const DateButton = forwardRef<HTMLButtonElement>(
    ({ value, onClick, placeholder, ...props }: React.HTMLProps<HTMLButtonElement>, ref) => (
      <Button colorScheme="teal" variant={value ? 'solid' : 'outline'} onClick={onClick} ref={ref}>
        {value || placeholder}
      </Button>
    ),
  );

  return (
    <>
      <DatePicker
        dateFormat="dd.MM.yyyy"
        selected={start}
        placeholderText="Start Date"
        customInput={<DateButton />}
        onChange={setStart}
      />
      <DatePicker
        dateFormat="dd.MM.yyyy"
        selected={end}
        placeholderText="End Date"
        customInput={<DateButton />}
        onChange={setEnd}
      />
    </>
  );
};

export default RangeFilter;
