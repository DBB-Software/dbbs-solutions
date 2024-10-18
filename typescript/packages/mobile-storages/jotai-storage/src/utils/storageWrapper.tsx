import { MMKV } from 'react-native-mmkv'

const storage = new MMKV({ id: 'jotai-mobile-storage' })

const getItem = (key: string): string | null => {
  const value = storage.getString(key)
  return value || null
}

const setItem = (key: string, value: string): void => {
  storage.set(key, value)
}

const removeItem = (key: string): void => {
  storage.delete(key)
}

const clearAll = (): void => {
  storage.clearAll()
}

export const jotaiStorage = {
  getItem,
  setItem,
  removeItem,
  clearAll
}
