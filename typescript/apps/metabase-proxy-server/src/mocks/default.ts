import { jest } from '@jest/globals'

export const mockRedis = {
  get: jest.fn() as jest.Mock,
  set: jest.fn() as jest.Mock
}

export const mockSentry = {
  setContext: jest.fn() as jest.Mock
}

export const mockCollections = [
  { id: '1', name: 'Test Org', location: '/1/' },
  { id: '2', name: 'Another Org', location: '/2/' },
  { id: '3', name: 'Test Collection', location: '/1/3/' }
]

export const mockDashboards = [
  { id: 1, collection_id: '1' },
  { id: 2, collection_id: '2' }
]

export const mockOrganizations = [
  { id: '1', name: 'Org1' },
  { id: '2', name: 'Org2' }
]
