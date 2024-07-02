export default [
  {
    method: 'POST',
    path: '/products',
    handler: 'product.create',
    config: {}
  },
  {
    method: 'GET',
    path: '/products/:id',
    handler: 'product.getProductById',
    config: {}
  },
  {
    method: 'GET',
    path: '/products',
    handler: 'product.getProducts',
    config: {}
  },
  {
    method: 'PUT',
    path: '/products/:id',
    handler: 'product.update',
    config: {}
  },
  {
    method: 'DELETE',
    path: '/products/:id',
    handler: 'product.delete',
    config: {}
  }
]
