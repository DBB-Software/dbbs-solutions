export interface ICreateOrganizationParams {
  name: string
  email: string
}

export interface IUpdateOrganizationParams {
  name: string
  id: string
}

export interface IDeleteOrganizationParams {
  id: string
}
