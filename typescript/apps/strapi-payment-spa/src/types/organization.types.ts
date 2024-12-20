import { Organization } from '../interfaces'

export type GetOrganizationsResponse = Organization[]

export type UpdateOrganizationRequestParams = { name: string; quantity: number }
