export function fromString(pattern: string, flags: string) {
  const escapedPattern = pattern
    .replace('\^', '\\^')
    .replace('\$', '\\$')
    .replace('\.', '\\.')
    .replace('\|', '\\|')
    .replace('\?', '\\?')
    .replace('\*', '\\*')
    .replace('\+', '\\+')
    .replace('\(', '\\(')
    .replace('\)', '\\)')
    .replace('\{', '\\{')
    .replace('\}', '\\}')
    .replace('\[', '\\[')
    .replace('\]', '\\]')
    .replace('\s', '\\s')
    .replace('\S', '\\S')
    .replace('\d', '\\d')
    .replace('\D', '\\D')
    .replace('\w', '\\w')
    .replace('\W', '\\W')
    .replace('\b', '\\b')
    .replace('\B', '\\B');

  return new RegExp(escapedPattern, flags);
}
