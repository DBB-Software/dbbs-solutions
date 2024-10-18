export default [
  {
    method: 'GET',
    path: '/admin/purchases/:id',
    handler: 'purchase.getAllPurchases',
    config: {}
  }
]
