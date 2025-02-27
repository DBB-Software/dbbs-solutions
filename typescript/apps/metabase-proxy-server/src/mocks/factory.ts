import { AuthRequest } from '../interfaces/index.js'

interface Params {
  [key: string]: string
}

export const createMockRequest = (userEmail = 'tests@example.com'): AuthRequest =>
  ({
    user: { email: userEmail }
  }) as AuthRequest

export const createMockParams = (params: Params = {}) => ({
  ...params
})
