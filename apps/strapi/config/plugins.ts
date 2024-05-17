/**
 * Configuration for JWT secrets used in user permissions.
 * @param {Function} env - Environment variable access function.
 * @returns {Object} Configuration object specifying the JWT secret for user authentication.
 */
export default ({ env }) => ({
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET', 'tobemodified')
    }
  }
})
