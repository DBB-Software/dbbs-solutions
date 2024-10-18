export interface Account {
  firstName: string
  lastName: string
  userId: string
  provider: string
}

export interface CreateAccountParams {
  userId: string
  provider: string
}

export interface UpdateAccountParams {
  id: string
  firstName: string
  lastName: string
}
