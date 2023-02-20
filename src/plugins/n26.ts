import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { normalizeCSVValue, normalizeAccountNumber } from './common';
import type { AccountType } from '../models/Account';
import type { TransactionType } from '../models/Transaction';

dayjs.extend(customParseFormat);

export function parseCSV(
  text: string,
  accountNumber: string,
): {
  account: Omit<AccountType, 'owner'>;
  transactions: Array<TransactionType>;
} {
  const number = normalizeAccountNumber(accountNumber);

  /**
   * It happens that separate entries generate the same ID. Therefore we keep track of them
   * and optionally add an index to it.
   */
  const transactionIndexMap: Record<string, number> = {};

  const [header, ...lines] = text.split('\n');

  const transactions = lines
    .filter((value) => !!value.trim())
    .map((row) => {
      const [bookingDay, client, clientAccountNumber, text, note, amount] = row
        .split('","')
        .map(normalizeCSVValue);

      const parsedDate = dayjs(bookingDay, 'YYYY-MM-DD');

      if (!parsedDate.isValid()) {
        throw new Error('Invalid date');
      }

      let transactionId = [number, bookingDay, amount].join('_');

      if (transactionIndexMap[transactionId]) {
        transactionIndexMap[transactionId] += 1;

        transactionId += `_${transactionIndexMap[transactionId]}`;
      } else {
        transactionIndexMap[transactionId] = 1;
      }

      return {
        id: transactionId,
        accountIds: [],
        accountNumber: number,
        text,
        client,
        note,
        timestamp: parsedDate.unix(),
        amount: parseFloat(amount),
      };
    });

  const from = transactions[0].timestamp;
  const to = transactions[transactions.length - 1].timestamp;

  const accountId = [number, from, to].join('_');

  return {
    account: {
      id: accountId,
      number,
      bank: 'N26',
      type: 'Standard',
      transactionCount: transactions.length,
      from,
      to,
      createdAt: dayjs().unix(),
    },
    transactions: transactions.map((transaction) => ({ ...transaction, accountIds: [accountId] })),
  };
}
