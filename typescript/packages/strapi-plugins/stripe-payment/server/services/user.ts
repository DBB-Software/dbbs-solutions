import { Strapi } from '@strapi/strapi'

export default ({ strapi }: { strapi: Strapi }) => ({
  async getUsers() {
    return strapi.query('plugin::users-permissions.user').findMany()
  }
})
