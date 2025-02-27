import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const API_SLICE_KEY = 'admin-dashboard-api'

export enum ApiSliceTag {
  Geos = 'Geos',
  MeetingType = 'MeetingType'
}

export const apiSlice = createApi({
  reducerPath: API_SLICE_KEY,
  tagTypes: [ApiSliceTag.Geos, ApiSliceTag.MeetingType],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.WEB_APP_API_URL || 'http://localhost:3000',
    prepareHeaders: (headers) => {
      headers.set('Authorization', 'Bearer')
      headers.set('X-Forwarded-Proto', 'https')
      headers.set('Content-Type', 'application/json')

      return headers
    }
  }),

  endpoints: () => ({})
})

export const { middleware } = apiSlice
