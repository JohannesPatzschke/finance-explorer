export function normalizeCSVValue(value: string): string {
  return value.replace(/"/gim, '').replace(/\s{2,}/, ' ');
}

export function normalizeCurrencyNumber(value: string): number {
  return parseFloat(value.replace(/\./, '').replace(',', '.'));
}

export function normalizeAccountNumber(value: string): string {
  return value.replace(/\s/g, '');
}
