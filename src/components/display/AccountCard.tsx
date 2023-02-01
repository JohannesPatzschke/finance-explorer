import React, { useRef, useCallback } from 'react';
import {
  Heading,
  Text,
  Flex,
  Divider,
  Box,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CloseButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import BankLogo from './BankLogo';
import AccountNumber from './AccountNumber';
import { AccountType } from '@models/Account';
import useAccounts from '@hooks/useAccounts';
import useTransactions from '@hooks/useTransactions';

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

type AccountCardProps = {
  account: AccountType;
};

const AccountCard = ({ account }: AccountCardProps) => {
  const removeAccount = useAccounts((state) => state.removeAccount);
  const removeTransactionsByAccount = useTransactions((state) => state.removeTransactionsByAccount);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { id, bank, owner, number, type, transactionCount, from, to, createdAt } = account;

  const handleDelete = useCallback(() => {
    onClose();
    removeAccount(id);
    removeTransactionsByAccount(id);
  }, [id]);

  return (
    <>
      <DeleteDialog isOpen={isOpen} onClose={onClose} onDelete={handleDelete} />

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
            <CloseButton onClick={onOpen} />
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
            created at {dayjs.unix(createdAt).format('DD.MM.YYYY HH:mm')}
          </Text>
        </CardFooter>
      </Card>
    </>
  );
};

export default AccountCard;
