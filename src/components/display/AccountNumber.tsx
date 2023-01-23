import React from 'react';

const AccountNumber = ({ number }: { number: string }) => (
  <>{number.replace(/^(\D+).+(\d{4})$/, '$1...$2')}</>
);

export default AccountNumber;
