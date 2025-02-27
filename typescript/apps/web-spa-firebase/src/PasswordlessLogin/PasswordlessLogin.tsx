import React, { useEffect, useState } from 'react'
import {
  ActionCodeSettings,
  getAuth,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink
} from '@dbbs/firebase/app-auth'
import { Button, Input, Label } from '@dbbs/tailwind-components'

import { firebaseApp } from '../firebaseClient'
import { LoginWrapper } from '../LoginWrapper'
import { PASSWORDLESS_LOGIN_TEST_IDS } from './testIds'

const actionCodeSettings: ActionCodeSettings = {
  url: process.env.WEB_SPA_FIREBASE_BASE_URL ?? 'http://localhost:5173',
  handleCodeInApp: true
}

export const LOCAL_STORAGE_EMAIL_KEY = 'emailForSignIn'

const PasswordlessLogin: React.FC = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const auth = getAuth(firebaseApp)

    if (isSignInWithEmailLink(auth, window.location.href)) {
      const savedEmail = window.localStorage.getItem(LOCAL_STORAGE_EMAIL_KEY)

      if (savedEmail) {
        signInWithEmailLink(auth, savedEmail, window.location.href)
          .then(() => {
            window.localStorage.removeItem(LOCAL_STORAGE_EMAIL_KEY)
          })
          .catch((error) => {
            console.error('Error login using email-link:', error)
          })
      }
    }
  }, [])

  const handleSendLink = async () => {
    if (!email) return

    const auth = getAuth(firebaseApp)
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      window.localStorage.setItem(LOCAL_STORAGE_EMAIL_KEY, email)
      setMessage(`Link is send to ${email}`)
    } catch (error) {
      console.error('Error sending link:', error)
    }
  }

  return (
    <LoginWrapper title="Passwordless (Email Link) Auth">
      <div>
        <Label htmlFor={PASSWORDLESS_LOGIN_TEST_IDS.EMAIL_INPUT}>Enter your email:</Label>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id={PASSWORDLESS_LOGIN_TEST_IDS.EMAIL_INPUT}
          data-testid={PASSWORDLESS_LOGIN_TEST_IDS.EMAIL_INPUT}
        />
        {message && <div className="text-green-600">{message}</div>}

        <Button className="mt-2" onClick={handleSendLink} data-testid={PASSWORDLESS_LOGIN_TEST_IDS.SEND_LINK_BUTTON}>
          Send link
        </Button>
      </div>
    </LoginWrapper>
  )
}

export default PasswordlessLogin
