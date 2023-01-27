import React, { useCallback } from 'react';
import { Heading, List, ListItem, Button } from '@chakra-ui/react';
import CategoryCard from '../components/display/CategoryCard';

import useCategories from '../hooks/useCategories';
import useTransactions from '../hooks/useTransactions';
import { CategoryType } from '../models/Category';

const Categories = () => {
  const categories = useCategories((state) => state.categories);
  const saveCategory = useCategories((state) => state.saveCategory);
  const addSuggestions = useTransactions((state) => state.addSuggestions);

  const handleSave = useCallback((category: CategoryType) => {
    saveCategory(category);
    addSuggestions(category);
  }, []);

  return (
    <>
      <Heading size="lg">Categories</Heading>
      <br />
      <List spacing={5}>
        {categories.map((category) => (
          <ListItem key={category.id}>
            <CategoryCard category={category} onSave={handleSave} />
          </ListItem>
        ))}
        <ListItem>
          <Button size="xs" colorScheme="teal" variant="ghost">
            Add Category TODO
          </Button>
        </ListItem>
      </List>
    </>
  );
};

export default Categories;
