import { createStore } from 'jotai'
import { createJSONStorage } from 'jotai/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const persistor = createJSONStorage(() => AsyncStorage)

export const store = createStore()
