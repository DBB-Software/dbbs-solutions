import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, signOut, User } from '@dbbs/firebase/app-auth'
import { Button } from '@dbbs/tailwind-components'

import { firebaseApp } from '../firebaseClient'
import { LOGIN_WRAPPER_TEST_IDS } from './testIds'

type LoginWrapperProps = {
  title: string
}

const LoginWrapper: FC<PropsWithChildren<LoginWrapperProps>> = ({ children, title }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const auth = getAuth(firebaseApp)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    const auth = getAuth(firebaseApp)
    await signOut(auth)
  }

  return (
    <div className="p-2.5 max-w-screen-md mx-auto">
      <h1 data-testid={LOGIN_WRAPPER_TEST_IDS.TITLE}>{title}</h1>
      {user ? (
        <div>
          <p data-testid={LOGIN_WRAPPER_TEST_IDS.USER_EMAIL}>You logged in as: {user.email}</p>
          <Button data-testid={LOGIN_WRAPPER_TEST_IDS.LOGOUT_BUTTON} onClick={handleLogout}>
            Logout
          </Button>
        </div>
      ) : (
        children
      )}
    </div>
  )
}

export default LoginWrapper
