import React from 'react';
import { Heading, Text, Button, Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react';

const AddAccountCard = () => {
  return (
    <Card align="center">
      <CardHeader>
        <Heading size="md">Add Account</Heading>
      </CardHeader>
      <CardBody>
        <Text>Upload a bank statement to add some transactions.</Text>
      </CardBody>
      <CardFooter>
        <Button colorScheme="teal">Upload CSV</Button>
      </CardFooter>
    </Card>
  );
};

export default AddAccountCard;
