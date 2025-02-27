import { FC, CSSProperties, MouseEventHandler } from 'react'
import { GOOGLE_LOGOUT_BUTTON_TEST_ID } from './testIds'

export interface GoogleLogoutButtonProps {
  onSuccess?: () => void
  onError?: (error: Error) => void
  onRevokeSuccess?: () => void
  onRevokeError?: (error: Error) => void
  className?: string
  style?: CSSProperties
  buttonText?: string
  userIdentifier?: string
  revokeAccess?: boolean
}

const GoogleLogoutButton: FC<GoogleLogoutButtonProps> = ({
  onSuccess,
  onError,
  onRevokeSuccess,
  onRevokeError,
  className,
  style,
  userIdentifier = '', // Defaults to current user
  buttonText = 'Logout',
  revokeAccess = false
}) => {
  const handleLogout: MouseEventHandler<HTMLButtonElement> = async () => {
    try {
      if (!window.google) throw new Error('Google Identity Services script not loaded')

      window.google.accounts.id.disableAutoSelect()

      if (revokeAccess) {
        await new Promise<void>((resolve, reject) => {
          window.google.accounts.id.revoke(userIdentifier, (response) => {
            if (response.successful) {
              if (onRevokeSuccess) onRevokeSuccess()
              resolve()
            } else {
              const error = new Error(response.error || 'Failed to revoke token')
              if (onRevokeError) onRevokeError(error)
              reject(error)
            }
          })
        })
      }

      if (onSuccess) onSuccess()
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error)
      }
    }
  }

  return (
    <button
      onClick={handleLogout}
      data-testid={GOOGLE_LOGOUT_BUTTON_TEST_ID}
      className={`google-logout-button ${className || ''}`}
      style={style}
    >
      {buttonText}
    </button>
  )
}

export default GoogleLogoutButton
