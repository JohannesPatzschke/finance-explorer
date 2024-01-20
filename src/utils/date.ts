export function normalizeTimestamp(timestamp: number) {
  return timestamp < 10000000000 ? timestamp * 1000 : timestamp;
}
