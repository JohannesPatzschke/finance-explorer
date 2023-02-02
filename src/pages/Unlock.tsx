import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, Text } from '@chakra-ui/react';
import UnlockForm from '../components/forms/UnlockForm';

const Unlock = () => {
  return (
    <Modal isOpen={true} onClose={() => null}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Unlock Page</ModalHeader>
        <ModalBody>
          <Text>
            <b>New users:</b> Your bank data will be encrypted and saved in the local storage. Enter
            a secure secret and save it someplace safe.
          </Text>
          <br />
          <Text>
            <b>Returning users:</b> Enter you secret to unlock the page.
          </Text>
          <br />
          <UnlockForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Unlock;
