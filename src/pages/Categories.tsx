import React, { useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import { Heading, List, ListItem, Button } from '@chakra-ui/react';
import CategoryCard from '@components/display/CategoryCard';
import useCategories from '@hooks/useCategories';
import useTransactions from '@hooks/useTransactions';
import { CategoryType } from '@models/Category';
import { generateID } from '@utils/indexing';

const Categories = () => {
  const [categories, addCategory, saveCategory, removeCategory] = useCategories(
    (state) => [state.categories, state.addCategory, state.saveCategory, state.removeCategory],
    shallow,
  );
  const addSuggestions = useTransactions((state) => state.addSuggestions);

  const handleSave = useCallback((category: CategoryType) => {
    saveCategory(category);
    addSuggestions(category);
  }, []);

  const addNewCategory = useCallback(() => {
    addCategory({
      id: generateID(),
      name: 'New Category',
      groups: [
        {
          id: generateID(),
          name: 'New Group',
          expressions: [
            {
              id: generateID(),
              value: 'New Expressions',
              isRegExp: false,
            },
          ],
        },
      ],
    });
  }, []);

  return (
    <>
      <Heading size="lg">Categories</Heading>
      <br />
      <List spacing={5}>
        {categories.map((category) => (
          <ListItem key={category.id}>
            <CategoryCard category={category} onRemove={removeCategory} onSave={handleSave} />
          </ListItem>
        ))}
        <ListItem>
          <Button size="xs" colorScheme="teal" variant="ghost" onClick={addNewCategory}>
            Add Category
          </Button>
        </ListItem>
      </List>
    </>
  );
};

export default Categories;
