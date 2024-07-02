export interface PermissionAction {
  enabled: boolean
  policy: string
}

export interface PermissionController {
  [action: string]: PermissionAction
}

export interface PluginPermissions {
  controllers: {
    [controller: string]: PermissionController
  }
}

export interface Permissions {
  [plugin: string]: PluginPermissions
}

export interface SinglePermission {
  id: number
  action: string
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: string
  name: string
  description: string
  type: string
  createdAt: string
  updatedAt: string
  nb_users: number
}

export interface User {
  id: string
  iat: number
  exp: number
  [key: string]: unknown
}
