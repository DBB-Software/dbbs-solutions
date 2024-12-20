import { FetchData, createSecuredApi } from '../utils/api'

export const userApi = (params: FetchData) => {
  const { endpoint, ...rest } = params
  return createSecuredApi({
    endpoint: `/api/users${endpoint}`,
    ...rest
  })
}
export const fetchUserProfile = async () => userApi({ endpoint: '/me', method: 'GET' })

export const updateProfile = async (userId: string, data: { username: string; email: string }) =>
  userApi({ endpoint: `/${userId}`, method: 'PUT', data })
