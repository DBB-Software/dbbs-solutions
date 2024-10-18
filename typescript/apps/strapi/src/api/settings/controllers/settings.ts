/**
 * Controller actions for managing settings.
 * These actions handle requests to fetch settings for all tenants or a specific tenant.
 */

export default {
  /**
   * Retrieves and sends settings applicable to all tenants.
   * @param {Object} ctx - The context object, used for accessing and modifying the HTTP request and response.
   * @returns {void} Sets the response object's body to contain settings data.
   */
  getAllSettings: async (ctx) => {
    try {
      ctx.body = await strapi.service('api::settings.settings').getAllSettings()
    } catch (err) {
      ctx.body = err
    }
  },
  /**
   * Retrieves and sends settings for a specific tenant, identified by the tenantId parameter in the route.
   * @param {Object} ctx - The context object, which includes route parameters among other request-specific data.
   * @returns {void} Sets the response object's body to contain settings data for the specified tenant.
   */
  getSettings: async (ctx) => {
    try {
      const { tenantId } = ctx.params
      ctx.body = await strapi.service('api::settings.settings').getSettings(tenantId)
    } catch (err) {
      ctx.body = err
    }
  }
}
