export const createUniqueFileName = (value: string, filetype: string) => {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '')

  return `${timestamp}_${value.replaceAll(' ', '_')}.${filetype}`
}
