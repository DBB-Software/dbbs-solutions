import React from 'react'
import { withIAPContext } from 'react-native-iap'
import { useInitializeIAPConnection } from '../hooks'

interface MobilePaymentProviderProps {
  children: React.ReactNode
}

export const MobilePaymentContext = React.createContext({})

export const MobilePaymentProvider = withIAPContext(({ children }: MobilePaymentProviderProps) => {
  useInitializeIAPConnection()

  return <MobilePaymentContext.Provider value={{}}>{children}</MobilePaymentContext.Provider>
})
