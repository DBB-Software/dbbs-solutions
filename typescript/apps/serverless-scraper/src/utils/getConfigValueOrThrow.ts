export const getConfigValueOrThrow = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`No ${key} variable provided`)
  }
  return value
}
