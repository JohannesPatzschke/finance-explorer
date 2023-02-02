import React from 'react';

import { Avatar } from '@chakra-ui/react';

import DKBLogo from '../../assets/dkb.png';
import N26Logo from '../../assets/n26.png';

const LOGO_MAP: Record<string, { name: string; bg: string; color: string; src: string }> = {
  DKB: {
    name: 'D K',
    bg: '#148dea',
    color: '#ffffff',
    src: DKBLogo,
  },
  N26: {
    name: '2 6',
    bg: '#00ae97',
    color: '#ffffff',
    src: N26Logo,
  },
};

const BankLogo = ({ bank }: { bank: string }) => <Avatar {...(LOGO_MAP[bank] ?? { name: bank })} />;

export default BankLogo;
