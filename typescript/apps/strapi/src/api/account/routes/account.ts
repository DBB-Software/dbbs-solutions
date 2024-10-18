import strapi from '@strapi/strapi'

export default strapi.factories.createCoreRouter('api::account.account', {
  config: {
    create: {
      policies: [],
      middlewares: []
    },
    find: {
      policies: [],
      middlewares: []
    },
    findOne: {
      policies: [],
      middlewares: []
    },
    update: {
      policies: [],
      middlewares: []
    },
    delete: {
      policies: [],
      middlewares: []
    }
  }
})
