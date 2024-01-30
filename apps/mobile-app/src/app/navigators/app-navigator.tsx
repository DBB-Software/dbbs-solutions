import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import { HomeComponent } from '@screens/home.screen'

const { Navigator, Screen } = createStackNavigator()

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
