import { SetMetadata } from '@nestjs/common'
import { Auth0Roles } from '../enums/index.js'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)

export const Admin = () => Roles(Auth0Roles.ADMIN)
export const Authenticated = () => Roles(Auth0Roles.AUTHENTICATED, Auth0Roles.ADMIN)
export const Public = () => Roles(Auth0Roles.PUBLIC)
