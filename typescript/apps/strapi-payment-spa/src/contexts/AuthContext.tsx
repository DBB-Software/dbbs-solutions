import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'
import { User } from '../interfaces'
import config from '../config'
import { fetchUserProfile } from '../api/user.api.ts'

export interface AuthContextType {
  jwt: string | null
  user: User | null
  setAuthData: (newJwt: string, newUser: User) => void
  clearAuthData: () => void
  setUser: (user: User) => void
  logout: () => void
}

const { cookieExpirationTime } = config

export const AuthContext = createContext<AuthContextType | null>(null)

const getStoredJwt = (): string | undefined => Cookies.get('jwt')
const setStoredJwt = (jwt: string | null, expires: number) => {
  if (jwt) {
    Cookies.set('jwt', jwt, { expires })
  } else {
    Cookies.remove('jwt')
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jwt, setJwt] = useState<string | null>(getStoredJwt() || null)
  const [user, setUser] = useState<User | null>(null)

  const setAuthData = (newJwt: string, newUser: User) => {
    setStoredJwt(newJwt, Number(cookieExpirationTime))
    setJwt(newJwt)
    setUser(newUser)
  }

  const clearAuthData = () => {
    setStoredJwt(null, 0)
    setJwt(null)
    setUser(null)
  }

  const logout = () => {
    clearAuthData()
    window.location.href = '/'
  }

  useEffect(() => {
    const fetchData = async () => {
      if (jwt && !user) {
        try {
          const userData = await fetchUserProfile()
          setAuthData(jwt, userData)
        } catch (error) {
          console.error('Failed to fetch user', error)
          clearAuthData()
        }
      }
    }

    fetchData()
  }, [jwt, user])

  return (
    <AuthContext.Provider value={{ jwt, user, setAuthData, clearAuthData, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
