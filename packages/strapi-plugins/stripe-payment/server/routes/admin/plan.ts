export default [
  {
    method: 'POST',
    path: '/admin/plans',
    handler: 'plan.create',
    config: {}
  },
  {
    method: 'GET',
    path: '/admin/plans/:id',
    handler: 'plan.getPlanById',
    config: {}
  },
  {
    method: 'GET',
    path: '/admin/plans',
    handler: 'plan.getPlans',
    config: {}
  },
  {
    method: 'DELETE',
    path: '/admin/plans/:id',
    handler: 'plan.delete',
    config: {}
  }
]
