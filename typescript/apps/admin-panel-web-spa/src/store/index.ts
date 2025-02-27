import { configureStore } from '@reduxjs/toolkit'
import { PersistConfig, persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { rootReducer } from './reducer'
import { middleware as apiMiddleware, FILTERS_SLICE_KEY, filtersSlice } from '../data-access'

const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: filtersSlice.name,
  storage,
  whitelist: [FILTERS_SLICE_KEY]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(apiMiddleware)
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
