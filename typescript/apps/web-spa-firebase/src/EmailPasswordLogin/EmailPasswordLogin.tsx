import React, { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@dbbs/firebase/app-auth'
import { Button, Input, Label } from '@dbbs/tailwind-components'

import { firebaseApp } from '../firebaseClient'
import { LoginWrapper } from '../LoginWrapper'
import { EMAIL_PASSWORD_LOGIN_TEST_IDS } from './testIds'

const EmailPasswordLogin: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async () => {
    setError(null)
    if (!email || !password) {
      setError('Fill email and password')
      return
    }

    try {
      const auth = getAuth(firebaseApp)
      await createUserWithEmailAndPassword(auth, email, password)
      setEmail('')
      setPassword('')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err?.message || 'Error Sign Up')
      }
    }
  }

  const handleSignIn = async () => {
    setError(null)
    if (!email || !password) {
      setError('Fill email and password')
      return
    }

    try {
      const auth = getAuth(firebaseApp)
      await signInWithEmailAndPassword(auth, email, password)
      setEmail('')
      setPassword('')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err?.message || 'Error Sign In')
      }
    }
  }

  return (
    <LoginWrapper title="Email/Password Auth">
      <div>
        <div className="mb-2">
          <Label htmlFor={EMAIL_PASSWORD_LOGIN_TEST_IDS.EMAIL_INPUT}>Email:</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id={EMAIL_PASSWORD_LOGIN_TEST_IDS.EMAIL_INPUT}
            data-testid={EMAIL_PASSWORD_LOGIN_TEST_IDS.EMAIL_INPUT}
          />
        </div>

        <div className="mb-2">
          <Label htmlFor={EMAIL_PASSWORD_LOGIN_TEST_IDS.PASSWORD_INPUT}>Password:</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id={EMAIL_PASSWORD_LOGIN_TEST_IDS.PASSWORD_INPUT}
            data-testid={EMAIL_PASSWORD_LOGIN_TEST_IDS.PASSWORD_INPUT}
          />
        </div>

        {error && (
          <div className="text-red-500 mb-2" data-testid={EMAIL_PASSWORD_LOGIN_TEST_IDS.ERROR_MESSAGE}>
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSignUp} data-testid={EMAIL_PASSWORD_LOGIN_TEST_IDS.SIGN_UP_BUTTON}>
            Sign Up
          </Button>
          <Button onClick={handleSignIn} data-testid={EMAIL_PASSWORD_LOGIN_TEST_IDS.SIGN_IN_BUTTON}>
            Sign In
          </Button>
        </div>
      </div>
    </LoginWrapper>
  )
}

export default EmailPasswordLogin
