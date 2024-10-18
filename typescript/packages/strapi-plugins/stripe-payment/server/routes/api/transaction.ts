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
