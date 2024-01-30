import React from 'react'
import { render } from '@testing-library/react-native'
import { HomeComponent } from '@screens/home.screen'

test('HomeComponent should render properly with testID', () => {
  const { getByTestId } = render(<HomeComponent />)
  const mainComponent = getByTestId('test')
  expect(mainComponent).toBeDefined()
  expect(mainComponent).toBeVisible()
})
