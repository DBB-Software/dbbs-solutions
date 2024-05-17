/**
 * Configuration for routes related to settings management.
 * Defines routes to manage settings retrieval for all tenants or a specific tenant via HTTP GET requests.
 */
export default {
  routes: [
    {
      method: 'GET',
      path: '/settings',
      handler: 'settings.getAllSettings',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'GET',
      path: '/settings/:tenantId',
      handler: 'settings.getSettings',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
}
