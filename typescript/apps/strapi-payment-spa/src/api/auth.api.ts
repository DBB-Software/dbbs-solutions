import { createSecuredApi, FetchData, fetchData } from '../utils/api'
import config from '../config'

export const authApi = (params: FetchData) =>
  fetchData({
    endpoint: `/api/auth${params.endpoint}`,
    method: params.method,
    token: config.apiToken,
    data: params.data
  })

export const secureAuthApi = (params: FetchData) => {
  const { endpoint, ...rest } = params
  return createSecuredApi({
    endpoint: `/api/auth${endpoint}`,
    ...rest
  })
}

export const registerUser = (data: { email: string; password: string; username: string }) =>
  authApi({ endpoint: '/local/register', method: 'POST', data })

export const loginUser = (data: { identifier: string; password: string }) =>
  authApi({ endpoint: '/local', method: 'POST', data })

export const resetPassword = (data: { email: string }) =>
  authApi({ endpoint: '/forgot-password', method: 'POST', data })

export const changePassword = (data: { currentPassword: string; password: string; passwordConfirmation: string }) =>
  secureAuthApi({ endpoint: '/change-password', method: 'POST', data })
