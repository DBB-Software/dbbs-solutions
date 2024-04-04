export default ({ env }) => ({
  "users-permissions": {
    config: {
      jwtSecret: env('JWT_SECRET', 'tobemodified'),
    }
  }
})
