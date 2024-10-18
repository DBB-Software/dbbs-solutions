export const customPermissions = [
  {
    id: 1,
    action: 'plugin::test.test.test',
    createdAt: '1',
    updatedAt: '1'
  }
]

export const defaultPermissions = {
  permissions: {
    some: {
      controllers: {
        test: {
          action: {
            enabled: true
          }
        }
      }
    }
  }
}

export const userPermissions = {
  role: { permissions: [{ action: 'plugin::test.test.test' }] }
}

export const permissions = [
  {
    action: 'plugin::test.test.test'
  }
]

export const conditions = [{ field: 'user.id', operator: 'eq', value: 'user.id' }]
