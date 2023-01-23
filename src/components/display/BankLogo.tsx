import React from 'react';

import { Avatar } from '@chakra-ui/react';

import DKBLogo from '../../assets/dkb.png';

const BankLogo = ({ bank }: { bank: Bank }) => <Avatar name="Segun Adebayo" src={DKBLogo} />;

export default BankLogo;
