import { Permissions, PluginPermissions, PermissionController } from '../interfaces/index.js'

/**
 * Transforms permissions from Strapi format to a list of permission strings.
 * @function
 * @param {Permissions} permissions - The raw permissions from Strapi.
 * @returns {string[]} - The transformed permissions.
 */
export function transformPermissions(permissions: Permissions): string[] {
  return Object.keys(permissions).flatMap((plugin) => {
    const pluginPermissions: PluginPermissions = permissions[plugin]

    return Object.keys(pluginPermissions.controllers).flatMap((controller) => {
      const actions: PermissionController = pluginPermissions.controllers[controller]

      return Object.keys(actions).map((action) => `${plugin}.${controller}.${action}`)
    })
  })
}
