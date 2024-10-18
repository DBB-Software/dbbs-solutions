/**
 * Configuration for routes related to health checks.
 * Defines routes to access the health check functionality through HTTP GET requests.
 */
export default {
  routes: [
    {
      method: 'GET',
      path: '/healthcheck',
      handler: 'healthcheck.index',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
}
