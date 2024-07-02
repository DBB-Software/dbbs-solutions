export default [
  {
    method: 'POST',
    path: '/add-permissions',
    handler: 'permission.initializePermissions',
    config: {}
  },
  {
    method: 'GET',
    path: '/get-permissions',
    handler: 'permission.getPermissions',
    config: {
      auth: false
    }
  },
  {
    method: 'POST',
    path: '/create-permissions',
    handler: 'permission.createPermissions',
    config: {}
  }
]
