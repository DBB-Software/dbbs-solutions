import { useEffect, ReactElement, FC } from 'react'
import { Auth0Provider, Auth0ProviderOptions, useAuth0, RedirectLoginOptions, IdToken } from '@auth0/auth0-react'

export type ProtectedContentProps = {
  loadingComponent?: ReactElement
  redirectOptions?: RedirectLoginOptions
  useAccessToken?: boolean
  onAuthorized?: (data?: string | IdToken) => void
  children: ReactElement
}
export type AuthGuardProps = Auth0ProviderOptions & ProtectedContentProps

export const ProtectedContent: FC<ProtectedContentProps> = ({
  children,
  loadingComponent,
  redirectOptions,
  onAuthorized,
  useAccessToken
}) => {
  const { isAuthenticated, isLoading, user, loginWithRedirect, getAccessTokenSilently, getIdTokenClaims } = useAuth0()

  useEffect(() => {
    if ((!isAuthenticated || !user) && !isLoading) {
      loginWithRedirect(redirectOptions)
    }
    if (isAuthenticated && !isLoading) {
      const getTokenFN = useAccessToken ? getAccessTokenSilently : getIdTokenClaims
      getTokenFN().then((data) => {
        onAuthorized?.(data)
      })
    }
  }, [
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    redirectOptions,
    useAccessToken,
    getAccessTokenSilently,
    onAuthorized,
    getIdTokenClaims
  ])

  if (isLoading && loadingComponent) {
    return loadingComponent
  }

  return children
}

const AuthGuard: FC<AuthGuardProps> = ({
  children,
  loadingComponent,
  redirectOptions,
  onAuthorized,
  useAccessToken,
  ...providerProps
}) => (
  <Auth0Provider {...providerProps}>
    <ProtectedContent
      loadingComponent={loadingComponent}
      redirectOptions={redirectOptions}
      onAuthorized={onAuthorized}
      useAccessToken={useAccessToken}
    >
      {children}
    </ProtectedContent>
  </Auth0Provider>
)

export default AuthGuard
