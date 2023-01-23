import React from 'react';
import dayjs from 'dayjs';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { FiCheck } from 'react-icons/fi';
import type { TransactionType } from '../../models/Transaction';

type TransactionsTableProps = {
  transactions: Array<TransactionType>;
};

const TransactionRow = ({ transaction }: { transaction: TransactionType }) => {
  const {
    id,
    timestamp,
    text,
    client,
    note,
    amount,
    category = 'category',
    group = 'group',
  } = transaction;

  const hasSuggestion = category?.startsWith('?');

  return (
    <Tr>
      <Td>
        <Text>{dayjs.unix(timestamp).format('DD.MM.YY')}</Text>
        <Text fontSize="xs" as="i">
          {text}
        </Text>
      </Td>
      <Td isNumeric>{amount} €</Td>
      <Td>
        <Flex direction="row" align="center" justify="space-between">
          <div>
            <Text>{category}</Text>
            <Text fontSize="xs" as="i">
              {group}
            </Text>
          </div>
          {hasSuggestion && (
            <IconButton
              ml="3"
              size="xs"
              colorScheme="yellow"
              aria-label="Accept suggestion"
              icon={<FiCheck />}
            />
          )}
        </Flex>
      </Td>
      <Td>
        <Text>{client}</Text>
        <Text>{note}</Text>
      </Td>
    </Tr>
  );
};

const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  return (
    <TableContainer>
      <Table variant="simple" size="md" maxWidth="100%">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th isNumeric>Value</Th>
            <Th>Category</Th>
            <Th>Description</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TransactionsTable;
