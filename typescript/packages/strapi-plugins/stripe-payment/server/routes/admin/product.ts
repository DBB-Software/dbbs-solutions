export default [
  {
    method: 'POST',
    path: '/admin/products',
    handler: 'product.create',
    config: {}
  },
  {
    method: 'GET',
    path: '/admin/products/:id',
    handler: 'product.getProductById',
    config: {}
  },
  {
    method: 'GET',
    path: '/admin/products',
    handler: 'product.getProducts',
    config: {}
  },
  {
    method: 'PUT',
    path: '/admin/products/:id',
    handler: 'product.update',
    config: {}
  },
  {
    method: 'DELETE',
    path: '/admin/products/:id',
    handler: 'product.delete',
    config: {}
  }
]
