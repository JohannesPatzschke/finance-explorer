import React from 'react';
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
  useColorMode,
} from '@chakra-ui/react';

const Settings = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Heading size="lg">Settings</Heading>
      <br />
      <Heading size="md" mb={2}>
        General
      </Heading>
      <Divider mb={4} />
      <Card variant="outline">
        <CardBody>
          <Flex color="white">
            <Center w="150px">
              <Switch
                colorScheme="teal"
                isChecked={colorMode === 'dark'}
                onChange={toggleColorMode}
              />
            </Center>
            <Box flex="1">
              <Text as="b">Dark Mode</Text>
              <Text fontSize="sm">Toggle dark mode</Text>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};

export default Settings;
