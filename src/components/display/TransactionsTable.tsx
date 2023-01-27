import React, { useState } from 'react';
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
  Spinner,
} from '@chakra-ui/react';
import { FiCheck } from 'react-icons/fi';
import InfiniteScroll from 'react-infinite-scroll-component';
import useCategories from '../../hooks/useCategories';
import useTransactions from '../../hooks/useTransactions';
import type { TransactionType } from '../../models/Transaction';

const PAGE_SIZE = 20;

type TransactionsTableProps = {
  transactions: Array<TransactionType>;
};

const TransactionRow = ({ transaction }: { transaction: TransactionType }) => {
  const getGroupName = useCategories((state) => state.getGroupName);
  const acceptSuggestion = useTransactions((state) => state.acceptSuggestion);
  const { id, timestamp, text, client, note, amount, suggestion } = transaction;

  const { categoryId, groupId } = suggestion ?? transaction;

  const { category = '', group = '' } =
    categoryId && groupId ? getGroupName(categoryId, groupId) : {};

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
            <Text>{category ?? '-'}</Text>
            <Text fontSize="xs" as="i">
              {group}
            </Text>
          </div>
          {suggestion && (
            <IconButton
              ml="3"
              size="xs"
              colorScheme="yellow"
              aria-label="Accept suggestion"
              icon={<FiCheck />}
              onClick={() => acceptSuggestion(id)}
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
  const [pages, setPages] = useState(1);

  const transactionsSlice = transactions.slice(0, pages * PAGE_SIZE);

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
          <InfiniteScroll
            dataLength={transactionsSlice.length}
            next={() => setPages((current) => current + 1)}
            hasMore={transactionsSlice.length < transactions.length}
            loader={<Spinner />}
            endMessage={<Text as="i">END</Text>}
          >
            {transactionsSlice.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </InfiniteScroll>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TransactionsTable;
