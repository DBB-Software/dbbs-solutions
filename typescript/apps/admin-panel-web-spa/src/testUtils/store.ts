import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../data-access'
import { rootReducer } from '../store/reducer'

export const setupStore = ({ overrideReducer = {}, initialState = {} } = {}) => {
  const store = configureStore({
    reducer: overrideReducer || rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }).concat(apiSlice.middleware),
    preloadedState: initialState
  })

  return { store }
}
