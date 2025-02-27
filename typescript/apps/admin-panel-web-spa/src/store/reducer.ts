import { combineReducers } from '@reduxjs/toolkit'
import { apiSlice, filtersSlice } from '../data-access'

export const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  [filtersSlice.reducerPath]: filtersSlice.reducer
})
