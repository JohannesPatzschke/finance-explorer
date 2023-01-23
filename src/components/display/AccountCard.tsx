import React from 'react';
import {
  Heading,
  Text,
  Flex,
  Divider,
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import BankLogo from './BankLogo';
import AccountNumber from './AccountNumber';

type AccountCardProps = {
  account: Account;
};

const AccountCard = ({ account }: AccountCardProps) => {
  const { bank, owner, number, type, from, to, createdAt } = account;

  return (
    <Card maxW="md">
      <CardHeader>
        <Flex>
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <BankLogo bank={bank} />

            <Box>
              <Heading size="sm">{bank}</Heading>
              <Text>
                {type} (<AccountNumber number={number} />)
              </Text>
            </Box>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody>
        <Text>
          Transactions by <b>{owner}</b>
        </Text>
        <Text>
          done from <b>{dayjs(from).format('DD.MM.YYYY')}</b> to{' '}
          <b>{dayjs(to).format('DD.MM.YYYY')}</b>
        </Text>
      </CardBody>
      <Divider />
      <CardFooter
        justify="space-between"
        flexWrap="wrap"
        sx={{
          '& > button': {
            minW: '136px',
          },
        }}
      >
        <Text fontSize="xs" as="i">
          created at {dayjs(createdAt).format('DD.MM.YYYY HH:mm')}
        </Text>
      </CardFooter>
    </Card>
  );
};

export default AccountCard;
