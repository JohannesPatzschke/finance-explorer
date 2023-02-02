import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { normalizeCSVValue, normalizeCurrencyNumber } from './common';
import type { AccountType } from '../models/Account';
import type { TransactionType } from '../models/Transaction';

dayjs.extend(customParseFormat);

export function parseCSV(text: string): {
  account: Omit<AccountType, 'owner'>;
  transactions: Array<TransactionType>;
} {
  const [number, , from, to, , , , ...rest] = text.split('\n');

  const [, numberHit] = /"(\w+) \/ (\w+)"/.exec(number) ?? [];
  const [, fromHit] = /"(\d{2}\.\d{2}\.\d{4})"/.exec(from) ?? [];
  const [, toHit] = /"(\d{2}\.\d{2}\.\d{4})"/.exec(to) ?? [];

  const account = {
    number: numberHit,
    from: dayjs(fromHit, 'DD.MM.YYYY').unix(),
    to: dayjs(toHit, 'DD.MM.YYYY').unix(),
    createdAt: dayjs().unix(),
  };

  const accountId = [account.number, account.from, account.to].join('_');

  /**
   * It happens that separate entries generate the same ID. Therefore we keep track of them
   * and optionally add an index to it.
   */
  const transactionIndexMap: Record<string, number> = {};

  const transactions = rest.map((row) => {
    const [
      bookingDay,
      valuation,
      text,
      client,
      note,
      accountNumber,
      postalCode,
      amount,
      creditorId,
      mandateReference,
      customerReferenz,
    ] = row.split(';').map(normalizeCSVValue);

    const parsedDate = dayjs(bookingDay, 'DD.MM.YYYY');

    if (!parsedDate.isValid()) {
      throw new Error('Invalid date');
    }

    let transactionId = [bookingDay, amount].join('_');

    if (transactionIndexMap[transactionId]) {
      transactionIndexMap[transactionId] += 1;

      transactionId += `_${transactionIndexMap[transactionId]}`;
    } else {
      transactionIndexMap[transactionId] = 1;
    }

    return {
      id: transactionId,
      accountIds: [accountId],
      accountNumber: numberHit,
      text,
      client,
      note,
      timestamp: parsedDate.unix(),
      amount: normalizeCurrencyNumber(amount),
    };
  });

  return {
    account: {
      ...account,
      id: accountId,
      bank: 'DKB',
      type: 'Giro',
      transactionCount: transactions.length,
    },
    transactions,
  };
}
