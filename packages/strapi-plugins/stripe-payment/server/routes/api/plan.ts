/**
 *  router
 */
import extractUserMiddleware from '../../middlewares/extractUser.middleware'

export default [
  {
    method: 'GET',
    path: '/api/plans/:id',
    handler: 'plan.getPlanById',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware]
    }
  }
]
