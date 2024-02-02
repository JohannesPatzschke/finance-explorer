import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import AddTransactionsForm from '../forms/AddTransactionsForm';
import { parseCSV as parseDKB } from '../../plugins/dkbGiro';
import { parseCSV as parseN26 } from '../../plugins/n26';

import useAccountStore from '../../hooks/useAccounts';
import useTransactionsStore from '../../hooks/useTransactions';
import { AccountType } from '@models/Account';

type AddTransactionsModalProps = {
  account: AccountType;
  isOpen: boolean;
  onClose: () => void;
};

const AddTransactionsModal = ({ account, isOpen, onClose }: AddTransactionsModalProps) => {
  const addAccount = useAccountStore((state) => state.addAccount);
  const addTransactions = useTransactionsStore((state) => state.addTransactions);

  const handleAddTransactions = (values: { file: FileList }) => {
    const { file } = values;
    const { bank, owner, number } = account;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e?.target?.result ?? '';
      const { account, transactions } =
        bank === 'DKB'
          ? parseDKB(text.toString(), number ?? '')
          : parseN26(text.toString(), number ?? '');
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
        <ModalHeader>Add Transactions</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AddTransactionsForm onAdd={handleAddTransactions} onCancel={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddTransactionsModal;
