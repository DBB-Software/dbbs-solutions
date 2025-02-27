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
    region: env('REGION', 'eu-central-1'),
    endpoint: env('SETTINGS_SERVICE_ENDPOINT', 'http://localhhost:3003'),
    serviceName: env('SETTINGS_SERVICE_NAME', 'settingsServiceFunction')
  },
  stripe: {
    apiKey: env('STRIPE_API_KEY', ''),
    currency: 'usd',
    successPaymentUrl: env('STRIPE_SUCCESS_PAYMENT_URL', 'http://localhost:8080/success'),
    successSetupUrl: env('STRIPE_SUCCESS_SETUP_URL', 'http://localhost:8080/success'),
    webhookSecret: env('STRIPE_WEBHOOK_SECRET', ''),
    awsRegion: env('STRIPE_SES_REGION', 'eu-central-1'),
    sesSenderEmail: env('STRIPE_SES_SENDER_EMAIL', ''),
    domainUrl: env('DOMAIN_URL', '')
  },
  auth0: {
    signInCertificate: env('AUTH0_SIGN_IN_CERTIFICATE', ''),
    auth0Authorization: env('AUTH_AUTHORIZATION', '')
  }
})
