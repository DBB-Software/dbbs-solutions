import { Strapi } from '@strapi/strapi'

export default ({ strapi }: { strapi: Strapi }) => ({
  async initializePermissions(ctx) {
    const { permissionsConfig } = ctx.request.body

    try {
      await strapi.plugin('permissions-manager').service('permission').initializePermissions(permissionsConfig)
      ctx.send({ message: 'Permissions initialized successfully' })
    } catch (error) {
      ctx.throw(400, error.message)
    }
  },

  async getPermissions(ctx) {
    const permissions = await strapi.plugin('permissions-manager').service('permission').getPermissions()

    ctx.send(permissions)
  },

  async createPermissions(ctx) {
    const data = ctx.request.body

    try {
      await strapi.plugin('permissions-manager').service('permission').createPermissions(data)
      ctx.send({ message: 'Permissions successfully created' })
    } catch (error) {
      ctx.throw(400, error.message)
    }
  }
})
