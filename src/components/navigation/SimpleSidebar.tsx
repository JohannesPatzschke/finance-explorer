import React, { ReactNode, ReactText } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Highlight,
  Divider,
  Center,
} from '@chakra-ui/react';
import {
  FiHome,
  FiCreditCard,
  FiServer,
  FiBarChart2,
  FiDollarSign,
  FiSettings,
  FiMenu,
  FiGithub,
} from 'react-icons/fi';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { IconType } from 'react-icons';
import useVersion from '@hooks/useVersion';

interface LinkItemProps {
  name: string;
  icon: IconType;
  to: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, to: '/' },
  { name: 'Bank Accounts', icon: FiCreditCard, to: '/accounts' },
  { name: 'Categories', icon: FiServer, to: '/categories' },
  { name: 'Transactions', icon: FiDollarSign, to: '/transactions' },
  { name: 'Explore', icon: FiBarChart2, to: '/explore' },
  { name: 'Settings', icon: FiSettings, to: '/settings' },
];

export default function SimpleSidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const location = useLocation();
  const { version } = useVersion();

  return (
    <Flex
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="md" fontFamily="monospace" fontWeight="bold">
          <Highlight
            query="Finance"
            styles={{ px: '2', py: '1', rounded: 'full', bg: 'teal.500', color: 'white' }}
          >
            Finance Explorer
          </Highlight>
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          to={link.to}
          active={location.pathname === link.to}
        >
          {link.name}
        </NavItem>
      ))}

      <Center height="25px" position="absolute" bottom={5} left={0} right={0}>
        <Text fontSize="xs" mr={3}>
          v{version}
        </Text>
        <Divider orientation="vertical" />
        <IconButton
          aria-label="GitHub Repository"
          variant="link"
          as="a"
          href="https://github.com/JohannesPatzschke/finance-explorer"
          icon={<FiGithub />}
        />
      </Center>
    </Flex>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  to: string;
  active?: boolean;
  children: ReactText;
}
const NavItem = ({ icon, to, active, children, ...rest }: NavItemProps) => {
  return (
    <Link as={RouterLink} to={to} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={active ? 'gray.600' : ''}
        _hover={{
          bg: 'teal.500',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton variant="outline" onClick={onOpen} aria-label="open menu" icon={<FiMenu />} />

      <Text fontSize="lg" ml="8" fontFamily="monospace" fontWeight="bold">
        Finance Explorer
      </Text>
    </Flex>
  );
};
