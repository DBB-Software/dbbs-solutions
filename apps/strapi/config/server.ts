/**
 * Server configuration specifying host, port, and other application-level settings.
 * Includes configurations for webhooks and the administration panel.
 * @param {Function} env - Environment variable access function.
 * @returns {Object} Configuration object with detailed settings for the server and its components.
 */
export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 8080),
  app: {
    keys: env.array('APP_KEYS', ['tobemodified'])
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false)
  },
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'tobemodified')
    },
    serveAdminPanel: true,
    publicPath: '/admin'
  },
  settings: {
    region: env('REGION', ''),
    endpoint: env('SETTINGS_SERVICE_ENDPOINT', ''),
    serviceName: env('SETTINGS_SERVICE_NAME', '')
  }
});
