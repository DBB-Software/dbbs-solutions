export function sanitizeString(value: string, maxLength: number = 256) {
  return value
    .trim()
    .replace(/[^a-zA-Z\d]/g, '_')
    .slice(0, maxLength)
}
