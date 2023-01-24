import React from 'react';

import { Avatar } from '@chakra-ui/react';

import DKBLogo from '../../assets/dkb.png';

const BankLogo = ({ bank }: { bank: string }) => <Avatar name={bank} src={DKBLogo} />;

export default BankLogo;
