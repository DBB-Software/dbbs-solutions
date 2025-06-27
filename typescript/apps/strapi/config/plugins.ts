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
  },
  'config-sync': {
    enabled: true,
    config: {
      syncDir: 'config/sync/',
      destination: 'config/sync/',
      minify: false,
      soft: false
    }
  },
  'permissions-manager': {
    enabled: true
  },
  graphql: {
    config: {
      /**
       * The endpoint for the GraphQL API.
       *
       * @type {string}
       * @default '/graphql'
       */
      endpoint: '/graphql',

      /**
       * Enable or disable shadow CRUD.
       *
       * When enabled, Strapi automatically generates GraphQL CRUD operations for your content types.
       *
       * @type {boolean}
       * @default true
       */
      shadowCRUD: true,

      /**
       * Enable or disable the GraphQL Playground.
       *
       * When enabled, the GraphQL Playground is always accessible.
       *
       * @type {boolean}
       * @default false
       */
      playgroundAlways: false,

      /**
       * Set the maximum depth for your GraphQL queries.
       *
       * This helps to prevent excessively deep queries which can impact performance.
       *
       * @type {number}
       * @default 7
       */
      depthLimit: 7,

      /**
       * Set the maximum number of results that can be returned in a query.
       *
       * This helps to control the amount of data returned in a single query.
       *
       * @type {number}
       * @default 100
       */
      amountLimit: 100,

      apolloServer: {
        /**
         * Enable or disable tracing in Apollo Server.
         *
         * Tracing provides detailed performance information for each GraphQL query.
         *
         * @type {boolean}
         * @default false
         */
        tracing: false
      }
    }
  },
  sentry: {
    enabled: true,
    config: {
      dsn: env('SENTRY_DSN'),
      sendMetadata: true
    }
  },
  ckeditor: {
    enabled: true
  }
})
