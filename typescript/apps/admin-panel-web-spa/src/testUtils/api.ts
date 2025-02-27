import type { QueryStatus, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { SerializedError } from '@reduxjs/toolkit'

interface Action {
  error?: FetchBaseQueryError | SerializedError
  isError: boolean
  isSuccess: boolean
  status: QueryStatus
  data?: unknown
}

export const testApiErrorResponse = (action: Action, errorMessage: string) => {
  const { status, isError, error } = action

  expect(status).toEqual('rejected')
  expect(isError).toEqual(true)
  expect(error).toEqual({
    error: `Error: ${errorMessage}`,
    status: 'FETCH_ERROR'
  })
}

export const testApiSuccessResponse = (action: Action, response: unknown) => {
  const { isSuccess, status, data } = action
  expect(status).toEqual('fulfilled')
  expect(isSuccess).toEqual(true)
  expect(data).toEqual(response)
}

export const testApiUpdateSuccessResponse = (action: Pick<Action, 'data' | 'error'>, response: unknown) => {
  const { data, error } = action
  expect(error).toBeUndefined()
  expect(data).toEqual(response)
}

export const testApiUpdateErrorResponse = (action: Pick<Action, 'data' | 'error'>, errorMessage: string) => {
  const { error, data } = action

  expect(data).toBeUndefined()
  expect(error).toEqual({
    error: `Error: ${errorMessage}`,
    status: 'FETCH_ERROR'
  })
}
