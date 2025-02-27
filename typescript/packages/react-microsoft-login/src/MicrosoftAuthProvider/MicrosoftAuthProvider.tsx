import { FC, PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react'
import { MsalProvider } from '@azure/msal-react'
import { Configuration, PublicClientApplication } from '@azure/msal-browser'

import { MICROSOFT_AUTH_PROVIDER_DEFAULT_LOADER_TEST_ID } from './testids'

export type MicrosoftAuthProviderProps = PropsWithChildren<{
  loader?: ReactNode
  config: Configuration
}>

const MicrosoftAuthProvider: FC<MicrosoftAuthProviderProps> = ({ loader, config, children }) => {
  const msalInstanceRef = useRef(new PublicClientApplication(config))
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    msalInstanceRef.current
      .initialize()
      .then(() => {
        const accounts = msalInstanceRef.current.getAllAccounts()
        if (accounts.length) {
          msalInstanceRef.current.setActiveAccount(accounts[0])
        }
        setInitialized(true)
      })
      .catch((error) => {
        console.error('Error initializing MSAL:', error)
        setInitialized(true)
      })
  }, [])

  if (!initialized) {
    return loader || <div data-testid={MICROSOFT_AUTH_PROVIDER_DEFAULT_LOADER_TEST_ID} />
  }

  return <MsalProvider instance={msalInstanceRef.current}>{children}</MsalProvider>
}

export default MicrosoftAuthProvider
