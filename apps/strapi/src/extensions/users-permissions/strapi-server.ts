import { Strapi } from '@strapi/strapi'
import _ from 'lodash'
import { errors } from '@strapi/utils'

const fetchAndStructurePermissions = async () => {
  const [permissions, additionalPermissions] = await Promise.all([
    strapi.plugin('users-permissions').service('users-permissions').getActions(),
    strapi.query('plugin::users-permissions.permission').findMany()
  ])

  const transformedAdditionalPermissions = additionalPermissions.reduce((acc, permission) => {
    const [type, controller, action] = permission.action.split('.')
    if (!acc[type]) {
      acc[type] = { controllers: {} }
    }
    if (!acc[type].controllers[controller]) {
      acc[type].controllers[controller] = {}
    }
    acc[type].controllers[controller][action] = {
      enabled: permission.enabled,
      policy: permission.policy
    }
    return acc
  }, {})

  return _.merge(permissions, transformedAdditionalPermissions)
}

export default (plugin) => {
  // eslint-disable-next-line no-param-reassign
  plugin.controllers.permissions.getPermissions = async (ctx) => {
    const mergedPermissions = await fetchAndStructurePermissions()
    ctx.send({ permissions: mergedPermissions })
  }

  // eslint-disable-next-line no-param-reassign
  plugin.controllers.role.findOne = async (ctx) => {
    const { id } = ctx.params

    const role = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { id }, populate: ['permissions'] })

    if (!role) {
      throw new errors.NotFoundError(`Role with ID ${id} not found`)
    }

    const mergedPermissions = await fetchAndStructurePermissions()

    role.permissions.forEach(({ action }) => {
      const [type, controller, actionName] = action.split('.')
      Object.assign(mergedPermissions, {
        [type]: {
          controllers: {
            [controller]: {
              [actionName]: {
                enabled: true,
                policy: ''
              }
            }
          }
        }
      })
    })

    ctx.send({ role: { ...role, permissions: mergedPermissions } })
  }

  // eslint-disable-next-line no-param-reassign
  plugin.services.role.deleteRole = async (roleID, publicRoleID) => {
    const role = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { id: roleID }, populate: ['users', 'permissions'] })

    if (!role) {
      throw new errors.NotFoundError('Role not found')
    }

    await Promise.all(
      role.users.map((user) => {
        return strapi.query('plugin::users-permissions.user').update({
          where: { id: user.id },
          data: { role: publicRoleID }
        })
      })
    )

    await strapi.query('plugin::users-permissions.role').delete({ where: { id: roleID } })
  }

  return plugin
}
