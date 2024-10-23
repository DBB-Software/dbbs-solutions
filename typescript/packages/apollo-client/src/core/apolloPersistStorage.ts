import { MMKV } from 'react-native-mmkv'

export const apolloStorage = new MMKV({ id: 'apollo-storage' })

export class ApolloPersistStorage {
  persistStorage: MMKV

  constructor(persistStorage: MMKV) {
    this.persistStorage = persistStorage
  }

  setItem(name: string, value: string) {
    return this.persistStorage.set(name, value)
  }

  getItem(name: string) {
    const value = this.persistStorage.getString(name)
    return value ?? null
  }

  removeItem(name: string) {
    return this.persistStorage.delete(name)
  }
}

export const defaultApolloPersistStorage = new ApolloPersistStorage(apolloStorage)
