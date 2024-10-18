import React, { ReactElement, FC } from 'react'
import { Auth0Provider, useAuth0 } from 'react-native-auth0'

export type ProtectedContentProps = {
  loadingComponent?: ReactElement
  fallback: ReactElement
  children: ReactElement
}
export type AuthGuardProps = {
  domain: string
  clientId: string
} & ProtectedContentProps

export const ProtectedContent: FC<ProtectedContentProps> = ({ children, fallback, loadingComponent }) => {
  const { isLoading, user } = useAuth0()

  if (isLoading && loadingComponent) {
    return loadingComponent
  }

  if (user) {
    return children
  }

  return fallback
}

const AuthGuard: FC<AuthGuardProps> = ({ children, loadingComponent, fallback, domain, clientId }) => (
  <Auth0Provider clientId={clientId} domain={domain}>
    <ProtectedContent loadingComponent={loadingComponent} fallback={fallback}>
      {children}
    </ProtectedContent>
  </Auth0Provider>
)

export default AuthGuard
