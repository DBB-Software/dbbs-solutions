import { useReducer, useCallback, createContext, type PropsWithChildren, useMemo, useContext } from 'react'

export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS'

export interface User {
  aud: string
  auth_time: number
  email: string
  email_verified: boolean
  exp: number
  name: string
  user_id: string
}

export interface AppState {
  user: User | null
}

export interface AppAction {
  type: typeof LOG_OUT_SUCCESS
}

const defaultState: AppState = {
  user: null
}

export interface AppActions {
  onLogOut: () => void
}

const AppContext = createContext<[AppState, AppActions]>([defaultState, { onLogOut: () => null }])

export const AppProvider = ({ initialState, children }: PropsWithChildren<{ initialState?: AppState }>) => {
  const reducer = useCallback((state: AppState, action: AppAction) => {
    if (action.type === LOG_OUT_SUCCESS) {
      return {
        ...state,
        user: null
      }
    }

    return state
  }, [])

  const [state, dispatch] = useReducer(reducer, { ...defaultState, ...initialState })

  const onLogOut = useCallback(() => {
    dispatch({ type: LOG_OUT_SUCCESS })
  }, [dispatch])

  const actions = useMemo(() => ({ onLogOut }), [onLogOut])

  return <AppContext.Provider value={[state, actions]}>{children}</AppContext.Provider>
}

export const useAppState = () => useContext(AppContext)
