import { useRef } from 'react'
import { persistCache, PersistentStorage } from 'apollo3-cache-persist'
import {
  ApolloClient,
  ApolloLink,
  DefaultOptions,
  InMemoryCache,
  NormalizedCacheObject,
  TypePolicies
} from '@apollo/client'
import { defaultApolloPersistStorage } from './apolloPersistStorage'

export interface GqlClient {
  apolloLink: ApolloLink
  gqlLink?: string
  typePolicies?: TypePolicies
  persistStorage?: PersistentStorage<string>
  apolloDefaultOptions?: DefaultOptions
}

export const useGraphQLClient = ({
  apolloLink,
  gqlLink,
  typePolicies,
  persistStorage,
  apolloDefaultOptions
}: GqlClient) => {
  const cache = new InMemoryCache({
    typePolicies
  })

  const unAuthorizedCache = new InMemoryCache()

  const unAuthorizedClient = useRef<ApolloClient<NormalizedCacheObject>>(
    new ApolloClient({
      uri: gqlLink,
      cache: unAuthorizedCache
    })
  )

  persistCache({
    cache,
    storage: persistStorage ?? defaultApolloPersistStorage
  })

  const authorizedClient = useRef<ApolloClient<NormalizedCacheObject>>(
    new ApolloClient({
      cache,
      link: apolloLink,
      defaultOptions: apolloDefaultOptions
    })
  )

  return { authorizedClient: authorizedClient.current, unAuthorizedClient: unAuthorizedClient.current }
}
