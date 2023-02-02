import React from 'react';
import { Select } from '@chakra-ui/react';
import { flatten } from 'lodash';
import useCategories from '@hooks/useCategories';
import { CategoryType } from '@models/Category';

type CategorySelectProps = {
  placeholder?: string;
};

function flattenOptions(categories: Array<CategoryType>) {
  return flatten(
    categories.map(({ id, name, groups }) =>
      groups.map((group) => ({ value: `${id}:${group.id}`, label: `${name} > ${group.name}` })),
    ),
  );
}

const CategorySelect = ({ placeholder = '-' }: CategorySelectProps) => {
  const categories = useCategories((state) => state.categories);

  const options = flattenOptions(categories);

  return (
    <Select variant="flushed" placeholder={placeholder}>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Select>
  );
};

export default CategorySelect;
