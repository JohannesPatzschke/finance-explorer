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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Tag,
} from '@chakra-ui/react';
import { FiCheck } from 'react-icons/fi';
import InfiniteScroll from 'react-infinite-scroll-component';
import useCategories from '@hooks/useCategories';
import useTransactions from '@hooks/useTransactions';
import CategoryMenu from '@components/overlay/CategoryMenu';
import type { TransactionType } from '@models/Transaction';

const PAGE_SIZE = 20;

type TransactionsTableProps = {
  transactions: Array<TransactionType>;
};

type TransactionRowProps = {
  transaction: TransactionType;
  isPopoverTarget?: boolean;
  onCategoryClick(): void;
};

const TransactionRow = ({
  transaction,
  isPopoverTarget = false,
  onCategoryClick,
}: TransactionRowProps) => {
  const getGroupName = useCategories((state) => state.getGroupName);
  const acceptSuggestion = useTransactions((state) => state.acceptSuggestion);
  const { id, timestamp, text, client, note, amount, suggestion } = transaction;

  const { categoryId, groupId } = suggestion ?? transaction;

  const { category = '-', group = '' } =
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
            {isPopoverTarget ? (
              <PopoverTrigger>
                <Tag>{category ?? '-'}</Tag>
              </PopoverTrigger>
            ) : (
              <Tag colorScheme="teal" cursor="pointer" onClick={onCategoryClick}>
                {category ?? '-'}
              </Tag>
            )}
            <br />
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const setCategory = useTransactions((state) => state.setCategory);

  const handleCategoryClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleCategorySelect = (categoryId: string, groupId: string) => {
    const transactionId = selectedIndex !== null ? transactions[selectedIndex]?.id : null;

    if (transactionId) {
      setCategory(transactionId, categoryId, groupId);
    }

    setSelectedIndex(null);
  };

  const transactionsSlice = transactions.slice(0, pages * PAGE_SIZE);

  return (
    <Popover
      returnFocusOnClose={false}
      isOpen={selectedIndex !== null}
      onClose={() => setSelectedIndex(null)}
      placement="right"
      closeOnBlur={true}
    >
      <TableContainer>
        <InfiniteScroll
          dataLength={transactionsSlice.length}
          next={() => setPages((current) => current + 1)}
          hasMore={transactionsSlice.length < transactions.length}
          loader={<Spinner />}
          endMessage={<Text as="i">END</Text>}
        >
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
              {transactionsSlice.map((transaction, index) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  isPopoverTarget={selectedIndex === index}
                  onCategoryClick={() => handleCategoryClick(index)}
                />
              ))}
            </Tbody>
          </Table>
        </InfiniteScroll>
      </TableContainer>
      <PopoverContent>
        {selectedIndex !== null && (
          <PopoverBody>
            <CategoryMenu isOpen={selectedIndex !== null} onSelect={handleCategorySelect} />
          </PopoverBody>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default TransactionsTable;
