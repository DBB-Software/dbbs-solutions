import { useRef } from 'react'
import { persistCache } from 'apollo3-cache-persist'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { useGraphQLClient, GqlClient, defaultApolloPersistStorage } from '../../src'

jest.mock('apollo3-cache-persist', () => ({
  persistCache: jest.fn()
}))

jest.mock('@apollo/client', () => ({
  ApolloClient: jest.fn(),
  InMemoryCache: jest.fn()
}))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn()
}))

const testCases = [
  {
    description: 'should initialize clients with default storage and provided apolloLink',
    input: {
      apolloLink: { some: 'link' },
      gqlLink: 'http://example.com/graphql',
      typePolicies: { TestType: { keyFields: ['id'] } },
      apolloDefaultOptions: { watchQuery: { fetchPolicy: 'cache-and-network' } }
    },
    expectedPersistStorage: defaultApolloPersistStorage
  },
  {
    description: 'should initialize clients with custom persistent storage',
    input: {
      apolloLink: { some: 'link' },
      gqlLink: 'http://example.com/graphql',
      persistStorage: { customStorage: 'myStorage' }
    },
    expectedPersistStorage: { customStorage: 'myStorage' }
  },
  {
    description: 'should initialize clients without type policies and default options',
    input: {
      apolloLink: { some: 'link' },
      gqlLink: 'http://example.com/graphql'
    },
    expectedPersistStorage: defaultApolloPersistStorage
  }
]

describe('useGraphQLClient', () => {
  beforeEach(() => {
    const apolloClientMock = ApolloClient as jest.Mock
    const inMemoryCacheMock = InMemoryCache as jest.Mock
    const persistCacheMock = persistCache as jest.Mock
    const useRefMock = useRef as jest.Mock
    apolloClientMock.mockClear()
    inMemoryCacheMock.mockClear()
    persistCacheMock.mockClear()
    useRefMock.mockImplementation((initialValue) => ({ current: initialValue }))
  })

  test.each(testCases)('$description', async ({ input, expectedPersistStorage }) => {
    const { authorizedClient, unAuthorizedClient } = useGraphQLClient(input as unknown as GqlClient)

    expect(InMemoryCache).toHaveBeenCalledWith({
      typePolicies: input.typePolicies || undefined
    })

    expect(ApolloClient).toHaveBeenCalledWith({
      uri: input.gqlLink,
      cache: expect.any(InMemoryCache)
    })

    expect(ApolloClient).toHaveBeenCalledWith({
      cache: expect.any(InMemoryCache),
      link: input.apolloLink,
      defaultOptions: input.apolloDefaultOptions || undefined
    })

    expect(persistCache).toHaveBeenCalledWith({
      cache: expect.any(InMemoryCache),
      storage: expectedPersistStorage
    })

    expect(authorizedClient).toBeInstanceOf(ApolloClient)
    expect(unAuthorizedClient).toBeInstanceOf(ApolloClient)
  })
})
