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
import { parseCSV } from '../../plugins/dkbGiro';

import useAccountStore from '../../hooks/useAccounts';

const AddAccountModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const addAccount = useAccountStore((state) => state.addAccount);

  const handleAddAccount = (values) => {
    const { owner, file } = values;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e?.target?.result ?? '';
      const { account, transactions } = parseCSV(text);

      addAccount({ ...account, owner });
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
      <Card align="center">
        <CardHeader>
          <Heading size="md">Add Account</Heading>
        </CardHeader>
        <CardBody>
          <Text>Upload a bank statement to add some transactions.</Text>
          <Text fontSize="xs" as="i">
            (Only DKB giro accounts are currently supported)
          </Text>
        </CardBody>
        <CardFooter>
          <Button colorScheme="teal" onClick={onOpen}>
            Upload CSV
          </Button>
        </CardFooter>
      </Card>
      <AddAccountModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default AddAccountCard;
