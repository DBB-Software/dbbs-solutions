import { createStore } from 'jotai'
import { createJSONStorage } from 'jotai/utils'
import { jotaiStorage } from './utils/storageWrapper'

export const persistor = createJSONStorage(() => jotaiStorage)

export const store = createStore()
