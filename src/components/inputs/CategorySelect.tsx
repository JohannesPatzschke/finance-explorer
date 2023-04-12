import React from 'react';

import { Select } from '@chakra-ui/react';
import { CategoryType } from '@models/Category';
import useCategories from '@hooks/useCategories';
import COLOR_PALETTE from '@constants/colorPalette.json';

type CategorySelectProps = {
  onChange: (category: CategoryType) => void;
};

const CategorySelect = ({ onChange }: CategorySelectProps) => {
  const categories = useCategories((state) => state.categories).map((category, index) => ({
    ...category,
    fill: COLOR_PALETTE[index % COLOR_PALETTE.length],
  }));

  const handleChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    const id = target.value;

    const category = categories.find((category) => category.id === id);

    if (category) {
      onChange(category);
    }
  };

  return (
    <Select placeholder="Select category" onChange={handleChange}>
      {categories.map(({ id, name }) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </Select>
  );
};

export default CategorySelect;
