/**
 *  router
 */

export default [
  {
    method: 'POST',
    path: '/plans',
    handler: 'plan.create',
    config: {}
  },
  {
    method: 'GET',
    path: '/plans/:id',
    handler: 'plan.getPlanById',
    config: {}
  },
  {
    method: 'GET',
    path: '/plans',
    handler: 'plan.getPlans',
    config: {}
  }
]
