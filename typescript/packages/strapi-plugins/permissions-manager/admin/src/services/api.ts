import { request } from '@strapi/helper-plugin'
import { AddPermissionsInterface } from '../interfaces/permissions'

export class ApiService {
  static getRoles() {
    return request('/users-permissions/roles', { method: 'GET' })
  }

  static createPermissions(actions: string[]) {
    return request('/permissions-manager/create-permissions', { method: 'POST', body: actions })
  }

  static addPermissions(permissions: AddPermissionsInterface) {
    return request('/permissions-manager/add-permissions', {
      method: 'POST',
      body: { permissionsConfig: { permissions } }
    })
  }
}
