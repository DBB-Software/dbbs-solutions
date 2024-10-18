export interface Permission {
  api?: string
  controller: string
  action: string
  plugin?: string
  permissionString: string
}

export interface AddPermissionsInterface {
  [key: string]: string[]
}
