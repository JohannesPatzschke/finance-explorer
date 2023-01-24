import React from 'react';
import { Heading, List, ListItem } from '@chakra-ui/react';
import CategoryCard from '../components/display/CategoryCard';

import useCategories from '../hooks/useCategories';

const Categories = () => {
  const categories = useCategories((state) => state.categories);

  return (
    <>
      <Heading size="lg">Categories</Heading>
      <br />
      <List spacing={5}>
        {categories.map((category) => (
          <ListItem key={category.id}>
            <CategoryCard category={category} />
          </ListItem>
        ))}
        <ListItem>
          <CategoryCard />
        </ListItem>
      </List>
    </>
  );
};

export default Categories;
