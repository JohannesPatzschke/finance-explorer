import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, Text } from '@chakra-ui/react';
import UnlockForm from '../components/forms/UnlockForm';

const Unlock = () => {
  const newUser = !localStorage.getItem('version');

  return (
    <Modal isOpen={true} onClose={() => null}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Unlock Page</ModalHeader>
        <ModalBody>
          {newUser ? (
            <Text>
              Your bank data will be <b>encrypted</b> and <b>saved</b> in your <b>local storage</b>.
              <br />
              <br />
              Enter a secure secret and save it someplace safe.
            </Text>
          ) : (
            <Text>Enter your secret to unlock the page.</Text>
          )}
          <br />
          <UnlockForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Unlock;
