import { Strapi } from '@strapi/strapi'

export default ({ strapi }: { strapi: Strapi }) => ({
  async addPermission(action: string) {
    let permission = await strapi.query('plugin::users-permissions.permission').findOne({
      where: { action }
    })

    if (!permission) {
      permission = await strapi.query('plugin::users-permissions.permission').create({
        data: { action, roles: [] }
      })
    }

    return permission
  },

  async createRoleIfNotExists(roleName: string, action: string) {
    let role = await strapi.query('plugin::users-permissions.role').findOne({
      where: { name: roleName },
      populate: ['permissions']
    })

    if (!role) {
      const permission = await this.addPermission(action)

      role = await strapi.query('plugin::users-permissions.role').create({
        data: {
          name: roleName,
          description: `${roleName} role`,
          type: roleName.toLowerCase(),
          permissions: [permission]
        },
        populate: ['permissions']
      })
    }

    return role
  },

  async assignPermissionToRole(roleName: string, action: string) {
    const role = await this.createRoleIfNotExists(roleName, action)

    const existingPermission = role.permissions.find((p) => p.action === action)

    if (!existingPermission) {
      const newPermission = await strapi.query('plugin::users-permissions.permission').create({
        data: { action }
      })

      const rolePermissions = role.permissions || []
      rolePermissions.push(newPermission)

      await strapi.query('plugin::users-permissions.role').update({
        where: { id: role.id },
        data: { permissions: rolePermissions }
      })
    }
  },

  async initializePermissions(permissionsConfig: { permissions: { [roleName: string]: string[] } }) {
    const rolesEntries = Object.entries(permissionsConfig.permissions)

    const assignPermissionsPromises = rolesEntries.map(([roleName, actions]) => {
      const assignPermissionPromises = actions.map((action) => this.assignPermissionToRole(roleName, action))
      return Promise.all(assignPermissionPromises)
    })

    await Promise.all(assignPermissionsPromises)
  },

  async getPermissions() {
    return strapi.query('plugin::users-permissions.permission').findMany()
  },

  async createPermissions(permissionsConfig: string[]) {
    const creationPromises = permissionsConfig.map((action) => this.addPermission(action))
    await Promise.all(creationPromises)

    return true
  }
})
