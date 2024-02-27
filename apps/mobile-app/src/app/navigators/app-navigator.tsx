import React from 'react'
import { createMaterialBottomTabNavigator } from '@dbbs/mobile-components'
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import { HomeComponent } from '@screens/home.screen'

const { Navigator, Screen } = createMaterialBottomTabNavigator()

export const navigationRef = createNavigationContainerRef()

export const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Navigator>
        <Screen name="Home" component={HomeComponent} />
      </Navigator>
    </NavigationContainer>
  )
}
