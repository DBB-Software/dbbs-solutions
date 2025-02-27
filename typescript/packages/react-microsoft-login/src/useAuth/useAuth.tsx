import { useMsal, useIsAuthenticated } from '@azure/msal-react'
import { PopupRequest, RedirectRequest } from '@azure/msal-browser'

export type MicrosoftLoginRequest = PopupRequest | RedirectRequest

const useAuth = (loginRequest: MicrosoftLoginRequest) => {
  const isAuthenticated = useIsAuthenticated()
  const { instance, accounts } = useMsal()

  const signInPopup = async () => {
    try {
      await instance.loginPopup(loginRequest)
    } catch (error) {
      console.error(error)
    }
  }

  const signInRedirect = async () => {
    try {
      await instance.loginRedirect(loginRequest)
    } catch (error) {
      console.error(error)
    }
  }

  const signOutPopup = async () => {
    try {
      await instance.logoutPopup()
    } catch (error) {
      console.error(error)
    }
  }

  const signOutRedirect = async () => {
    try {
      await instance.logoutRedirect()
    } catch (error) {
      console.error(error)
    }
  }

  const account = isAuthenticated && accounts.length > 0 ? accounts[0] : undefined

  return {
    isAuthenticated,
    signInPopup,
    signInRedirect,
    signOutPopup,
    signOutRedirect,
    account
  }
}

export default useAuth
