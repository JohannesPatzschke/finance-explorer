import React, { useState, forwardRef } from 'react';
import { Card, CardBody, HStack, Button } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import useFilters from '@hooks/useFilters';
import { shallow } from 'zustand/shallow';

const RangeFilter = () => {
  const [start, end, setStart, setEnd] = useFilters(
    (state) => [state.start, state.end, state.setStart, state.setEnd],
    shallow,
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
