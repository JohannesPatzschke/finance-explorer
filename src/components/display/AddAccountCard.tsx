import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Heading,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from '@chakra-ui/react';
import AddAccountForm from '../forms/AddAccountForm';
import { parseCSV as parseDKB } from '../../plugins/dkbGiro';
import { parseCSV as parseN26 } from '../../plugins/n26';

import useAccountStore from '../../hooks/useAccounts';
import useTransactionsStore from '../../hooks/useTransactions';

const AddAccountModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const addAccount = useAccountStore((state) => state.addAccount);
  const addTransactions = useTransactionsStore((state) => state.addTransactions);

  const handleAddAccount = (values: {
    plugin: string;
    owner: string;
    number?: string;
    file: FileList;
  }) => {
    const { plugin, owner, number, file } = values;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e?.target?.result ?? '';

      const { account, transactions } =
        plugin === 'dkb' ? parseDKB(text.toString()) : parseN26(text.toString(), number ?? '');

      addAccount({ ...account, owner });
      addTransactions(transactions);
      onClose();
    };
    reader.readAsText(file[0]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AddAccountForm onAdd={handleAddAccount} onCancel={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const AddAccountCard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Card align="center" variant="outline" maxW="md">
        <CardHeader>
          <Heading size="md">Add Account</Heading>
        </CardHeader>
        <CardBody>
          <Text>Upload a bank statement to add some transactions.</Text>
          <Text fontSize="xs" as="i">
            (Only DKB giro and N26 accounts are currently supported)
          </Text>
        </CardBody>
        <CardFooter>
          <Button size="sm" colorScheme="teal" onClick={onOpen}>
            Upload CSV
          </Button>
        </CardFooter>
      </Card>
      <AddAccountModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default AddAccountCard;
