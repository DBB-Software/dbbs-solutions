import { useCallback } from 'react'

import { CommonActions, NavigationContainerRefWithCurrent } from '@react-navigation/native'

export const COMMON_NAVIGATION_ERROR = 'No navigationRef'

export interface NavigationParams extends Record<string, string | number | object | undefined> {
  slug?: string
}

export const useCommonNavigation = (
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>
) => {
  const navigate = useCallback(
    (routeName: string, params?: NavigationParams) => {
      if (navigationRef.isReady() && routeName) {
        const action = CommonActions.navigate({
          name: routeName,
          key: params?.slug ?? '',
          params
        })
        navigationRef.dispatch(action)
      } else {
        console.error(COMMON_NAVIGATION_ERROR)
      }
    },
    [navigationRef]
  )

  return navigate
}
