import React from 'react'
import { Icon, createMaterialBottomTabNavigator } from '@dbbs/mobile-components'
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import { HomeComponent } from '@screens/home.screen'
import BootSplash from 'react-native-bootsplash'
import { useRNPushNotificationNavigation } from '@dbbs/mobile-react-native-notifications'
import { useDeepLinking, useCommonNavigation } from '@dbbs/mobile-common'

const { Navigator, Screen } = createMaterialBottomTabNavigator()

export const navigationRef = createNavigationContainerRef()

export const AppNavigator = () => {
  const commonNavigation = useCommonNavigation(navigationRef)

  useRNPushNotificationNavigation({ navigateToContent: (metadata) => commonNavigation(metadata?.screen ?? 'Home') })

  useDeepLinking({
    navigateToContent: (params) => commonNavigation(JSON.stringify(params.$canonical_identifier))
  })

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        BootSplash.hide({ fade: true })
      }}
    >
      <Navigator>
        <Screen
          name="Home"
          component={HomeComponent}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }: { color: string }) => <Icon size={20} source="home" color={color} />
          }}
        />
      </Navigator>
    </NavigationContainer>
  )
}
