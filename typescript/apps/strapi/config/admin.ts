/**
 * Configuration for application authentication and API tokens.
 * @param {Function} env - Environment variable access function.
 * @returns {Object} Configuration object with settings for authentication secrets and API token salts.
 */
export default ({ env }) => ({
  auth: {
    // Secret key used for signing JWTs for admin authentication.
    secret: env('ADMIN_JWT_SECRET', 'tobemodified')
  },
  apiToken: {
    // Salt used for hashing API tokens to enhance security.
    salt: env('API_TOKEN_SALT', 'tobemodified')
  },
  transfer: {
    token: {
      // Salt used specifically for transfer tokens within the application.
      salt: env('TRANSFER_TOKEN_SALT')
    }
  },
  flags: {
    // Feature flags to enable/disable specific application features dynamically.
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true)
  }
})
