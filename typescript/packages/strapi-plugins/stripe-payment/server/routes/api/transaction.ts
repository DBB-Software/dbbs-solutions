/**
 * TODO: Add logic to conditionally choose the middleware based on the selected authorization method.
 * If Auth0 is selected, use `auth0AuthMiddleware`, otherwise use `extractUserMiddleware`.
 */
import extractUserMiddleware from '../../middlewares/extractUser.middleware'

export default [
  {
    method: 'GET',
    path: '/api/transactions',
    handler: 'transaction.getAllTransactions',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware]
    }
  }
]
