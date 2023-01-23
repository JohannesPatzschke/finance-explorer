import React from 'react';
import { useForm } from 'react-hook-form';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  ButtonGroup,
  Input,
  Button,
  Box,
} from '@chakra-ui/react';
import useEncryptedStorage from '../../hooks/useEncryptedStorage';

const UnlockForm = () => {
  const { unlockStorage } = useEncryptedStorage();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(values) {
    unlockStorage(values.secret);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.secret}>
        <FormLabel htmlFor="secret">Secret</FormLabel>
        <Input
          id="secret"
          placeholder="***"
          type="password"
          {...register('secret', {
            required: 'This is required',
          })}
        />
        <FormErrorMessage>{errors.secret && errors.secret.message?.toString()}</FormErrorMessage>
      </FormControl>
      <Box textAlign="right" pt="6" pb="3">
        <ButtonGroup gap="2">
          <Button colorScheme="teal" mr={3} isLoading={isSubmitting} type="submit">
            Unlock
          </Button>
        </ButtonGroup>
      </Box>
    </form>
  );
};

export default UnlockForm;
