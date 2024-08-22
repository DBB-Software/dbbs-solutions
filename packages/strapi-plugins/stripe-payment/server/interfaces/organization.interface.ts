export interface CreateOrganizationParams {
  name: string
  ownerId: string
  email: string
  quantity: number
}

export interface UpdateOrganizationParams {
  quantity: number
  name: string
  id: number
}

export interface GetOrganizationByIdParams {
  id: number
}

export interface GetMyOrganizationsParams {
  userId: number
}

export interface GetPaymentMethodParams {
  id: number
}

export interface DeleteOrganizationParams {
  id: number
}

export interface UpdateOwnerParams {
  ownerId: number
  id: number
}

export interface CreateDefaultPaymentMethodUpdateCheckoutSessionParams {
  id: number
}

export interface AddUserParams {
  organizationId: number
  recipientEmail: string
}

export interface RemoveUserParams {
  organizationId: number
  userId: number
}

export interface AcceptInviteParams {
  organizationId: number
  userId: number
  token: string
}
