import React, { useRef, useCallback } from 'react';
import {
  Heading,
  Text,
  Flex,
  Divider,
  Box,
  IconButton,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { FiMoreVertical, FiPlus, FiList, FiTrash } from 'react-icons/fi';
import dayjs from 'dayjs';
import BankLogo from './BankLogo';
import AccountNumber from './AccountNumber';
import AddTransactionsModal from '@components/overlays/AddTransactionsModal';
import useAccounts from '@hooks/useAccounts';
import useTransactions from '@hooks/useTransactions';
import type { AccountGroupType } from '@hooks/useAccountGroups';

const DeleteDialog = ({
  isOpen,
  onClose,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}) => {
  const cancelRef = useRef(null);

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Account
          </AlertDialogHeader>

          <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

          <AlertDialogBody>
            If you want to update the data for the same bank account, add your other account export
            prior to deleting this one.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button size="sm" ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" colorScheme="red" onClick={onDelete} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

type AccountGroupCardProps = {
  group: AccountGroupType;
};

const AccountGroupCard = ({ group }: AccountGroupCardProps) => {
  const removeAccount = useAccounts((state) => state.removeAccount);
  const removeTransactionsByAccount = useTransactions((state) => state.removeTransactionsByAccount);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure();

  const { id, bank, owner, number, type, transactionCount, from, to, createdAt, updatedAt } = group;

  const handleDelete = useCallback(() => {
    onClose();
    removeAccount(id);
    removeTransactionsByAccount(id);
  }, [id]);

  return (
    <>
      <DeleteDialog isOpen={isOpen} onClose={onClose} onDelete={handleDelete} />
      <AddTransactionsModal account={group} isOpen={isOpenAdd} onClose={onCloseAdd} />

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
            <Menu>
              <MenuButton as={IconButton} icon={<FiMoreVertical />} />

              <MenuList>
                <MenuItem icon={<FiPlus />} onClick={onOpenAdd}>
                  Add Transactions
                </MenuItem>
                <MenuItem icon={<FiList />}>Show Transactions</MenuItem>
                <MenuDivider />
                <MenuItem icon={<FiTrash />} color="red.400">
                  Delete Account
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </CardHeader>
        <CardBody>
          <Text>
            <b>{transactionCount}</b> transactions by <b>{owner}</b>
          </Text>
          <Text>
            done from <b>{dayjs.unix(from).format('DD.MM.YYYY')}</b> to{' '}
            <b>{dayjs.unix(to).format('DD.MM.YYYY')}</b>
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
            updated at {dayjs.unix(updatedAt ?? createdAt).format('DD.MM.YYYY HH:mm')}
          </Text>
        </CardFooter>
      </Card>
    </>
  );
};

export default AccountGroupCard;
