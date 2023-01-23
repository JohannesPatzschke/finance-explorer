import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { AccountType } from '../models/Account';
import type { TransactionType } from '../models/Transaction';

dayjs.extend(customParseFormat);

function normalizeCSVValue(value: string): string {
  return value.replace(/"/gim, '').replace(/\s{2,}/, ' ');
}

function normalizeCurrencyNumber(value: string): number {
  return parseFloat(value.replace(/\./, '').replace(',', '.'));
}

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
    from: dayjs(fromHit, 'DD.MM.YYYY').toISOString(),
    to: dayjs(toHit, 'DD.MM.YYYY').toISOString(),
    createdAt: dayjs().toISOString(),
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
      accountId,
      text,
      client,
      note,
      timestamp: parsedDate.toISOString(),
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
