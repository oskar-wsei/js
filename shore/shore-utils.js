export function toInt(value, fallbackIfNaN = 0) {
  const parsed = parseInt(value);
  return isNaN(parsed) ? fallbackIfNaN : parsed;
}

export function asArray(value) {
  return Array.isArray(value) ? value : [value];
}
