export type UserDbRecord = {
  id: number
  username: string
  email: string
  provider: string
  password: string
  resetPasswordToken: string
  confirmationToken: string
  confirmed: number
  blocked: number
  organizationId: number | undefined
  createdAt: string
  updatedAt: string
}
