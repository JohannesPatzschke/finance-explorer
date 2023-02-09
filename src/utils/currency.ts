export function toCurrency(value: number, currency = '€'): string {
  return `${value.toLocaleString('DE-de', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}
