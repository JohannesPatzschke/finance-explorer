import React, { useState } from 'react';
import { Menu, MenuItem, Slide, Box } from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import useCategories from '@hooks/useCategories';
import { CategoryType } from '@models/Category';

type CategoryMenu = {
  isOpen: boolean;
  onSelect(categoryId: string, groupId: string): void;
};

const CategoryMenu = ({ isOpen, onSelect }: CategoryMenu) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const categories = useCategories((state) => state.categories);

  return (
    <Menu isOpen={isOpen}>
      <div>
        {categories.map((category) => (
          <MenuItem
            key={category.id}
            isDisabled={!!selectedCategory}
            onClick={() => setSelectedCategory(category)}
          >
            {category.name}
          </MenuItem>
        ))}
      </div>
      <Slide direction="right" in={!!selectedCategory} style={{ zIndex: 10 }}>
        <Box p="10px" bg="gray.600" rounded="md" shadow="md">
          <MenuItem onClick={() => setSelectedCategory(null)}>
            <FiArrowLeft />
          </MenuItem>
          {selectedCategory?.groups.map(({ id, name }) => (
            <MenuItem key={id} onClick={() => onSelect(selectedCategory.id, id)}>
              {name}
            </MenuItem>
          ))}
        </Box>
      </Slide>
    </Menu>
  );
};

export default CategoryMenu;
