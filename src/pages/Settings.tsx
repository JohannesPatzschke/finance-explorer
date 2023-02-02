import React from 'react';
import dayjs from 'dayjs';
import { shallow } from 'zustand/shallow';
import {
  Heading,
  Divider,
  Card,
  CardBody,
  Text,
  Flex,
  Center,
  Box,
  Switch,
  Button,
  VStack,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import { FiDownload, FiUpload, FiTrash } from 'react-icons/fi';
import UploadButton from '@components/inputs/UploadButton';
import useAccounts from '@hooks/useAccounts';
import useCategories from '@hooks/useCategories';
import useTransactions from '@hooks/useTransactions';
import { BackupObject } from '@models/Backup';
import { downloadJSON, readJSONFile } from '@utils/JSONFiles';
import useFilters from '@hooks/useFilters';

type EntryProps = {
  key: string;
  action: React.ReactNode;
  title: string;
  description: string;
};

const Entry = ({ action, title, description }: EntryProps) => (
  <Flex color="white">
    <Center w="175px">{action}</Center>
    <Box flex="1">
      <Text as="b">{title}</Text>
      <Text fontSize="sm">{description}</Text>
    </Box>
  </Flex>
);

type SectionProps = {
  title: string;
  entries: Array<EntryProps>;
};

const Section = ({ title, entries = [] }: SectionProps) => (
  <>
    <Heading size="md" mb={2}>
      {title}
    </Heading>
    <Divider mb={4} />
    <Card variant="outline" mb={10}>
      <CardBody>
        <VStack spacing={6} alignItems="start">
          {entries.map((entry) => (
            <Entry {...entry} />
          ))}
        </VStack>
      </CardBody>
    </Card>
  </>
);

const Settings = () => {
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const [accounts, setAccounts, resetAccounts] = useAccounts(
    (state) => [state.accounts, state.setAccounts, state.resetAccounts],
    shallow,
  );
  const [categories, setCategories, resetCategories] = useCategories(
    (state) => [state.categories, state.setCategories, state.resetCategories],
    shallow,
  );
  const [transactions, setTransactions, resetTransactions] = useTransactions(
    (state) => [state.transactions, state.setTransactions, state.resetTransactions],
    shallow,
  );
  const [start, end, categoryMap, setFilters, resetFilters] = useFilters(
    (state) => [state.start, state.end, state.categoryMap, state.setFilters, state.resetFilters],
    shallow,
  );

  const handleImport = async (files: FileList | null) => {
    if (files?.[0]) {
      const data = await readJSONFile(files?.[0]);

      try {
        const backup = BackupObject.parse(data);

        setAccounts(backup.accounts);
        setCategories(backup.categories);
        setTransactions(backup.transactions);
        setFilters(backup.filters);
        toast({
          title: `Backup successfully imported`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: `Invalid format.`,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <Heading size="lg">Settings</Heading>
      <br />
      <Section
        title="General"
        entries={[
          {
            key: 'darkMode',
            action: (
              <Switch
                colorScheme="teal"
                isChecked={colorMode === 'dark'}
                onChange={toggleColorMode}
              />
            ),
            title: 'Dark Mode',
            description: 'Toggle dark mode',
          },
        ]}
      />
      <Section
        title="Storage"
        entries={[
          {
            key: 'export',
            action: (
              <Button
                leftIcon={<FiDownload />}
                colorScheme="teal"
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadJSON(`finance_explorer_export_${dayjs().unix()}`, {
                    accounts,
                    categories,
                    transactions,
                    filters: { start, end, categoryMap },
                  })
                }
              >
                Export
              </Button>
            ),
            title: 'Export Data',
            description: 'Create a backup JSON of your data',
          },
          {
            key: 'import',
            action: (
              <UploadButton
                leftIcon={<FiUpload />}
                colorScheme="teal"
                variant="outline"
                size="sm"
                onChange={handleImport}
              >
                Import
              </UploadButton>
            ),
            title: 'Import Data',
            description: 'Import a previously created backup',
          },
          {
            key: 'clearAccounts',
            action: (
              <Button
                leftIcon={<FiTrash />}
                colorScheme="red"
                variant="outline"
                size="sm"
                onClick={() => {
                  resetAccounts();
                  resetTransactions();
                }}
              >
                Accounts
              </Button>
            ),
            title: 'Delete accounts & transaction',
            description: 'Clear your imported bank data',
          },
          {
            key: 'clearCategories',
            action: (
              <Button
                leftIcon={<FiTrash />}
                colorScheme="red"
                variant="outline"
                size="sm"
                onClick={() => resetCategories()}
              >
                Categories
              </Button>
            ),
            title: 'Delete categories',
            description: 'Reset categories to the default ones',
          },
          {
            key: 'clearFilter',
            action: (
              <Button
                leftIcon={<FiTrash />}
                colorScheme="red"
                variant="outline"
                size="sm"
                onClick={() => resetFilters()}
              >
                Filters
              </Button>
            ),
            title: 'Delete filter',
            description: 'Reset filters to the default ones',
          },
          {
            key: 'clearAll',
            action: (
              <Button
                leftIcon={<FiTrash />}
                colorScheme="red"
                variant="outline"
                size="sm"
                onClick={() => {
                  resetAccounts();
                  resetCategories();
                  resetTransactions();
                  resetFilters();
                }}
              >
                Everything
              </Button>
            ),
            title: 'Delete everything',
            description: 'Clear you local storage completely',
          },
        ]}
      />
    </>
  );
};

export default Settings;
