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
  Select,
} from '@chakra-ui/react';

interface AccountData {
  plugin: string;
  owner: string;
  number?: string;
  file: FileList;
}

type AddAccountFormProps = {
  onAdd: (values: AccountData) => void;
  onCancel: () => void;
};

const AddAccountForm = ({ onAdd, onCancel }: AddAccountFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<AccountData>();

  return (
    <form onSubmit={handleSubmit(onAdd)}>
      <FormControl isInvalid={!!errors.plugin}>
        <FormLabel htmlFor="plugin">Plugin</FormLabel>
        <Select
          placeholder="Select option"
          {...register('plugin', {
            required: 'This is required',
          })}
        >
          <option value="dkb">DKB Giro</option>
          <option value="n26">N26 Standard</option>
        </Select>
        <FormErrorMessage>{errors.plugin && errors.plugin.message?.toString()}</FormErrorMessage>
      </FormControl>
      <br />
      <FormControl isInvalid={!!errors.owner}>
        <FormLabel htmlFor="owner">Owner</FormLabel>
        <Input
          id="owner"
          placeholder="John Doe"
          {...register('owner', {
            required: 'This is required',
          })}
        />
        <FormErrorMessage>{errors.owner && errors.owner.message?.toString()}</FormErrorMessage>
      </FormControl>
      <br />
      <FormControl isInvalid={!!errors.number}>
        <FormLabel htmlFor="number">IBAN</FormLabel>
        <Input
          id="number"
          placeholder="DE1234..."
          {...register('number', {
            required: 'This is required',
          })}
        />
        <FormErrorMessage>{errors.number && errors.number.message?.toString()}</FormErrorMessage>
      </FormControl>
      <br />
      <FormControl isInvalid={!!errors.file}>
        <FormLabel htmlFor="file">File</FormLabel>
        <Input
          id="file"
          placeholder="1337.csv"
          type="file"
          {...register('file', {
            required: 'This is required',
          })}
        />
        <FormErrorMessage>{errors.file && errors.file.message?.toString()}</FormErrorMessage>
      </FormControl>
      <Box textAlign="right" pt="6" pb="3">
        <ButtonGroup gap="2">
          <Button size="sm" colorScheme="teal" mr={3} isLoading={isSubmitting} onClick={onCancel}>
            Close
          </Button>
          <Button size="sm" colorScheme="teal" variant="ghost" type="submit">
            Add
          </Button>
        </ButtonGroup>
      </Box>
    </form>
  );
};

export default AddAccountForm;
