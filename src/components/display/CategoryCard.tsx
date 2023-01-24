import React, { useRef, useCallback } from 'react';
import {
  Heading,
  Text,
  ButtonGroup,
  Box,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import BankLogo from './BankLogo';
import AccountNumber from './AccountNumber';
import { CategoryType } from '../../models/Category';
import useAccounts from '../../hooks/useAccounts';

type CategoryCardProps = {
  category?: CategoryType;
};

const CategoryCard = ({ category }: CategoryCardProps) => {
  const { name, groups } = category ?? {};

  return (
    <Card variant={category ? 'filled' : 'outline'}>
      <CardHeader>
        <Heading size="md">{name}</Heading>
      </CardHeader>

      <CardBody>
        <Box>
          <Heading size="xs" textTransform="uppercase">
            Groups
          </Heading>
          <Text pt="2" fontSize="sm">
            1, 2, 3...
          </Text>
        </Box>
      </CardBody>
      <CardFooter justify="end">
        <ButtonGroup gap="2">
          <Button size="sm" colorScheme="teal" mr={3}>
            Reset
          </Button>
          <Button size="sm" colorScheme="teal" variant="ghost" type="submit">
            Save
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;
