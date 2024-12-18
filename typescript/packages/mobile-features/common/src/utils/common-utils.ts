export const parseJSONWithFallback = <T = object>(data: string, defaultValue?: T | undefined): T | undefined => {
  try {
    return JSON.parse(data)
  } catch {
    return defaultValue
  }
}
