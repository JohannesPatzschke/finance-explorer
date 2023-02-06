import React from 'react';
import { Heading, Text } from '@chakra-ui/react';

type SectionProps = {
  title?: string;
  children: React.ReactNode;
};

const Section = ({ title, children }: SectionProps) => (
  <>
    {title && (
      <Heading as="h5" size="sm" mb={5}>
        {title}
      </Heading>
    )}
    <Text mb={12}>{children}</Text>
  </>
);

const Home = () => {
  return (
    <>
      <Heading size="lg">Welcome</Heading>
      <br />
      <Section>
        Import, categorize and visualize your bank data to better understand your financial
        behaviour.
      </Section>
      <Section title="Bank Accounts">Upload your bank statements to get started.</Section>
      <Section title="Categories">
        Define categories and groups to better categorize your data.
      </Section>
      <Section title="Transactions">A list of your transactions.</Section>
      <Section title="Explore">Dive deeper into the data.</Section>
      <Section title="Settings">Common settings.</Section>
    </>
  );
};

export default Home;
