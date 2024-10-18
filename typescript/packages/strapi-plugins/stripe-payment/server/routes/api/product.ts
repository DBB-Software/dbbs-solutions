import extractUserMiddleware from '../../middlewares/extractUser.middleware'

export default [
  {
    method: 'GET',
    path: '/api/products',
    handler: 'product.getProducts',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware]
    }
  },
  {
    method: 'GET',
    path: '/api/products/:id',
    handler: 'product.getProductById',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware]
    }
  }
]
