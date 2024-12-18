export interface User {
  id: number
  username: string
  email: string
  provider: string
  password: string
  resetPasswordToken: string | null
  confirmationToken: string | null
  confirmed: boolean
  blocked: boolean
  role: number
  createdAt: string
  updatedAt: string
}
