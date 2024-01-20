import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { normalizeCSVValue, normalizeCurrencyNumber, normalizeAccountNumber } from './common';
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

  const lines = text.split('\n').slice(5);

  const transactions = lines.map((row) => {
    const [
      bookingDay,
      valuation,
      status,
      payer,
      client,
      note,
      text,
      accountNumber,
      amount,
      creditorId,
      mandateReference,
      customerReferenz,
    ] = row.split(';').map(normalizeCSVValue);

    const parsedDate = dayjs(bookingDay, 'DD.MM.YY');

    if (!parsedDate.isValid()) {
      throw new Error(`Invalid date: ${bookingDay}`);
    }

    const normalizedAmount = normalizeCurrencyNumber(amount);

    let transactionId = [number, parsedDate.format('DD.MM.YYYY'), normalizedAmount].join('_');

    if (transactionIndexMap[transactionId]) {
      transactionIndexMap[transactionId] += 1;

      transactionId += `_${transactionIndexMap[transactionId]}`;
    } else {
      transactionIndexMap[transactionId] = 1;
    }

    return {
      id: transactionId,
      accountNumber: number,
      text,
      client,
      note,
      timestamp: parsedDate.unix(),
      amount: normalizedAmount,
    };
  });

  const to = transactions[0].timestamp;
  const from = transactions[transactions.length - 1].timestamp;

  const accountId = [number, from, to].join('_');

  return {
    account: {
      id: accountId,
      number,
      bank: 'DKB',
      type: 'Giro',
      transactionCount: transactions.length,
      from,
      to,
      createdAt: dayjs().unix(),
    },
    transactions: transactions.map((transaction) => ({ ...transaction, accountIds: [accountId] })),
  };
}
