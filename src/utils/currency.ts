export function toCurrency(value: number): string {
  return value.toLocaleString('DE-de', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
