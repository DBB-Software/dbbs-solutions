import { FC, CSSProperties, useEffect, useRef, useCallback } from 'react'
import { GsiButtonConfiguration, CredentialResponse, IdConfiguration } from 'google-one-tap'
import { GOOGLE_LOGIN_BUTTON_TEST_ID } from './testIds'

export const GOOGLE_IDENTITY_SERVICES_SCRIPT_URL = 'https://accounts.google.com/gsi/client'

export interface GoogleLoginButtonProps {
  clientId: string
  onSuccess: (response: CredentialResponse) => void
  onError: (error: Error) => void
  buttonText?: GsiButtonConfiguration['text']
  theme?: GsiButtonConfiguration['theme']
  size?: GsiButtonConfiguration['size']
  shape?: GsiButtonConfiguration['shape']
  uxMode?: IdConfiguration['ux_mode']
  cancelOneTapOutside?: IdConfiguration['cancel_on_tap_outside']
  promptOneTap?: boolean
  autoSelect?: boolean
  className?: string
  style?: CSSProperties
}

const GoogleLoginButton: FC<GoogleLoginButtonProps> = ({
  clientId,
  onSuccess,
  onError,
  buttonText = 'signin_with',
  theme = 'outline',
  size = 'large',
  shape = 'rectangular',
  cancelOneTapOutside = true,
  promptOneTap = true,
  autoSelect = false,
  className,
  uxMode,
  style
}) => {
  const buttonRef = useRef<HTMLDivElement | null>(null)

  const initializeGoogleAuth = useCallback(() => {
    try {
      if (!clientId) throw new Error('Google Client ID is required')
      if (!window.google) throw new Error('Google Identity Services script not loaded')

      window.google.accounts.id.initialize({
        client_id: clientId,
        cancel_on_tap_outside: cancelOneTapOutside,
        callback: (credentialResponse) => {
          if (credentialResponse.credential) {
            onSuccess(credentialResponse)
          } else {
            onError(new Error('Credential response is empty'))
          }
        },
        auto_select: autoSelect,
        ux_mode: uxMode
      })

      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme,
          size,
          text: buttonText,
          shape
        })
      }

      if (promptOneTap) {
        window.google.accounts.id.prompt()
      }
    } catch (error) {
      if (error instanceof Error) {
        onError(error)
      }
    }
  }, [
    clientId,
    cancelOneTapOutside,
    autoSelect,
    uxMode,
    promptOneTap,
    onSuccess,
    onError,
    theme,
    size,
    buttonText,
    shape
  ])

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script')
      script.src = GOOGLE_IDENTITY_SERVICES_SCRIPT_URL
      script.async = true
      script.defer = true
      script.onload = initializeGoogleAuth
      script.onerror = () => onError(new Error('Failed to load Google Identity Services script'))
      document.head.appendChild(script)

      return () => {
        document.head.removeChild(script)
      }
    }
    initializeGoogleAuth()
  }, [initializeGoogleAuth, onError])

  return (
    <div
      ref={buttonRef}
      className={`google-login-button ${className || ''}`}
      data-testid={GOOGLE_LOGIN_BUTTON_TEST_ID}
      style={style}
    />
  )
}

export default GoogleLoginButton
