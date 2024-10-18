import { useRef, useState, useEffect } from 'react'
import { AppState } from 'react-native'

type AppStateProps = {
  onAppStateChangedToBackground?: () => void
  onAppStateChangedToActive?: () => void
}

export const useAppState = ({ onAppStateChangedToActive, onAppStateChangedToBackground }: AppStateProps) => {
  const appState = useRef(AppState.currentState)
  const [appStateVisible, setAppStateVisible] = useState(appState.current)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        onAppStateChangedToActive?.()
      }
      if (appState.current.match(/active/) && (nextAppState === 'background' || nextAppState === 'inactive')) {
        onAppStateChangedToBackground?.()
      }

      appState.current = nextAppState
      setAppStateVisible(appState.current)
    })

    return () => {
      subscription.remove()
    }
  }, [onAppStateChangedToActive, onAppStateChangedToBackground])

  return { appStateVisible }
}
