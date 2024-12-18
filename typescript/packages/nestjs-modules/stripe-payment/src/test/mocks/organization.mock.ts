import { StripeCustomer, StripeResponse } from '@dbbs/nestjs-module-stripe'
import { defaultDate, defaultDateISOString } from './date.mock.js'
import { CreateOrganizationPayload } from '../../types/index.js'
import { OrganizationEntity } from '../../entites/index.js'
import { ICreateOrganizationParams, IOrganization } from '../../interfaces/index.js'

export const dbOrganizationsList = (baseId: number) =>
  Array.from({ length: 15 }, (_, index) => ({
    id: baseId + index + 1,
    name: `Organization ${baseId + index + 1}`,
    stripeCustomerId: `${baseId + index + 1}`,
    paymentMethodId: `${baseId + index + 1}`,
    ownerId: baseId + index + 1,
    subscription: baseId + index + 1,
    quantity: 10,
    createdAt: defaultDateISOString,
    updatedAt: defaultDateISOString
  }))

export const defaultOrganization: OrganizationEntity = {
  id: 1,
  name: 'Organization 1',
  quantity: 10,
  ownerId: 1,
  stripeCustomerId: 'org_1',
  subscription: null,
  createdAt: defaultDate,
  updatedAt: defaultDate
}

export const mockCreateOrganizationPayload = (baseId: number): CreateOrganizationPayload => ({
  name: `Organization ${baseId + 1}`,
  stripeCustomerId: `${baseId + 1}`,
  ownerId: baseId + 1,
  quantity: baseId
})

export const MOCK_CREATE_ORGANIZATION_PARAMS: ICreateOrganizationParams = {
  name: 'New organization',
  ownerId: 1234,
  email: 'email@mail.com',
  quantity: 10
}

export const MOCK_CREATED_ORGANIZATION: IOrganization = {
  id: 1234,
  name: 'New organization',
  quantity: 10,
  ownerId: 1234,
  stripeCustomerId: '1234',
  // TODO users
  subscription: null,
  createdAt: defaultDate,
  updatedAt: defaultDate
}

export const MOCK_STRIPE_CUSTOMER = {
  id: '1234'
} as StripeResponse<StripeCustomer>

export const mockCreatedOrganizationEntity = (baseId: number) => ({
  id: baseId + 1,

  name: `Organization ${baseId + 1}`,

  stripeCustomerId: `${baseId + 1}`,

  paymentMethodId: null,

  ownerId: baseId + 1,

  // TODO users

  subscription: null,

  purchases: undefined,

  quantity: baseId,

  invites: undefined,

  transactions: undefined,

  createdAt: defaultDate,

  updatedAt: defaultDate
})

export const defaultOrganizationEntity = (baseId: number): OrganizationEntity => ({
  id: baseId + 1,
  name: `Organization ${baseId + 1}`,
  stripeCustomerId: `${baseId + 1}`,
  paymentMethodId: `${baseId + 1}`,
  ownerId: baseId + 1,
  subscription: baseId + 1,
  quantity: 10,
  // TODO users
  purchases: undefined,
  invites: undefined,
  transactions: undefined,
  createdAt: defaultDate,
  updatedAt: defaultDate
})

export const stripeOrganization = {
  id: '1',
  name: 'Organization 1'
} as StripeResponse<StripeCustomer>

export const createOrganizationDto = {
  name: 'Organization 1'
}
