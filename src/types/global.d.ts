type Bank = 'DKB';

type AccountType = 'Giro' | 'Credit';

type DateString = string;

type Account = {
  id: string;
  bank: Bank;
  owner: string;
  number: string;
  type: AccountType;
  from: DateString;
  to: DateString;
  createdAt: DateString;
};
