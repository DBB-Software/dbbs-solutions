export default [
  {
    method: 'POST',
    path: '/admin/organizations',
    handler: 'organization.createByAdmin',
    config: {}
  },
  {
    method: 'GET',
    path: '/admin/organizations/:id',
    handler: 'organization.getOrganizationById',
    config: {}
  },
  {
    method: 'GET',
    path: '/admin/organizations',
    handler: 'organization.getAllOrganizations',
    config: {}
  },
  {
    method: 'PUT',
    path: '/admin/organizations/:id',
    handler: 'organization.update',
    config: {}
  },
  {
    method: 'DELETE',
    path: '/admin/organizations/:id',
    handler: 'organization.delete',
    config: {}
  },
  {
    method: 'PATCH',
    path: '/admin/organizations/:id/owner',
    handler: 'organization.updateOwner',
    config: {}
  },
  {
    method: 'PATCH',
    path: '/admin/organizations/:id/users',
    handler: 'organization.addUser',
    config: {}
  },
  {
    method: 'PATCH',
    path: '/admin/organizations/:id/remove-user',
    handler: 'organization.removeUser',
    config: {}
  }
]
