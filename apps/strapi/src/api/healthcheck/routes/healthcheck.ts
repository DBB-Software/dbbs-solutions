export default {
  routes: [
    {
      method: 'GET',
      path: '/healthcheck',
      handler: 'healthcheck.index',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
}
