import React from 'react'
import { Icon, createMaterialBottomTabNavigator } from '@dbbs/mobile-components'
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import { HomeComponent } from '@screens/home.screen'
import { useExpoPushNotificationNavigation } from '@dbbs/mobile-expo-notifications'
import { useCommonNavigation, useDeepLinking } from '@dbbs/mobile-common'

const { Navigator, Screen } = createMaterialBottomTabNavigator()

export const navigationRef = createNavigationContainerRef()

export const AppNavigator = () => {
  const commonNavigation = useCommonNavigation(navigationRef)

  useExpoPushNotificationNavigation({ navigateToContent: (metadata) => commonNavigation(metadata?.screen ?? 'Home') })

  useDeepLinking({
    navigateToContent: (params) => commonNavigation(JSON.stringify(params.$canonical_identifier))
  })

  return (
    <NavigationContainer ref={navigationRef}>
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
