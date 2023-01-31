import React, { useState } from 'react';
import {
  Checkbox,
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Text,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  VStack,
} from '@chakra-ui/react';
import produce from 'immer';
import useCategories from '@hooks/useCategories';
import useFilters from '@hooks/useFilters';
import { CategoryType } from '@models/Category';

type CategoryCheckboxGroupProps = {
  category: CategoryType;
  defaultChecked?: boolean | Array<string>;
  onChange(checked: boolean | Array<string>): void;
};

const CategoryCheckboxGroup = ({
  category,
  defaultChecked = true,
  onChange,
}: CategoryCheckboxGroupProps) => {
  const { name, groups = [] } = category;

  const [checkedItems, setCheckedItems] = React.useState(
    groups.map((group) =>
      typeof defaultChecked === 'boolean' ? defaultChecked : defaultChecked.includes(group.id),
    ),
  );

  const allChecked = checkedItems.every(Boolean);
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

  const handleChange = (nextValues: Array<boolean>) => {
    setCheckedItems(nextValues);

    if (nextValues.every(Boolean)) {
      onChange(true);
    } else if (nextValues.every((value) => !value)) {
      onChange(false);
    } else {
      onChange(
        nextValues
          .map((value, index) => (value ? groups[index].id : null))
          .filter((value): value is string => !!value),
      );
    }
  };

  return (
    <Stack>
      <Checkbox
        isChecked={allChecked}
        isIndeterminate={isIndeterminate}
        onChange={(e) => handleChange(groups.map(() => e.target.checked))}
      >
        {name}
      </Checkbox>
      <Stack pl={6} mt={1} spacing={1}>
        {groups.map((group, groupIndex) => (
          <Checkbox
            key={group.id}
            isChecked={checkedItems[groupIndex]}
            onChange={(e) =>
              handleChange(
                produce(checkedItems, (draft) => {
                  draft[groupIndex] = e.target.checked;
                }),
              )
            }
          >
            {group.name}
          </Checkbox>
        ))}
      </Stack>
    </Stack>
  );
};

type CategoryFilterSelectProps = {
  placeholder?: string;
};

const CategoryFilterSelect = ({}: CategoryFilterSelectProps) => {
  const [categoryMap, setCategory] = useFilters((state) => [state.categoryMap, state.setCategory]);
  const categories = useCategories((state) => state.categories);

  const onFilterChange = (categoryId: string, values: boolean | Array<string>) => {
    setCategory(categoryId, values);
  };
  const isCategoryFilterActive = Object.values(categoryMap).some((value) => value !== true);

  return (
    <Popover placement="right">
      <PopoverTrigger>
        <Button colorScheme="teal" variant={isCategoryFilterActive ? 'solid' : 'outline'}>
          Categories
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          <Text as="b">Categories</Text>
        </PopoverHeader>
        <PopoverBody>
          <VStack alignItems="start">
            {categories.map((category) => (
              <CategoryCheckboxGroup
                key={category.id}
                category={category}
                onChange={(values) => onFilterChange(category.id, values)}
              />
            ))}

            <Checkbox
              isChecked={categoryMap['__UNCATEGORIZED__'] !== false}
              onChange={(e) => onFilterChange('__UNCATEGORIZED__', e.target.checked)}
            >
              Uncategorized
            </Checkbox>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryFilterSelect;
