import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'
import { KeyboardView, KeyboardViewProps, KEYBOARD_AVOIDING_VIEW_TEST_ID } from '../../src'

describe('KeyboardView', () => {
  const DEFAULT_CHILDREN = <Text>Content</Text>

  const testData: KeyboardViewProps[] = [
    {
      children: DEFAULT_CHILDREN,
      iosBehavior: 'height',
      androidBehavior: 'height'
    },
    {
      children: DEFAULT_CHILDREN,
      iosBehavior: 'position',
      androidBehavior: 'position'
    },
    {
      children: DEFAULT_CHILDREN,
      iosBehavior: 'padding',
      androidBehavior: 'padding'
    }
  ]

  test.each(testData)('renders with the correct data for %s:', ({ children, iosBehavior, androidBehavior }) => {
    const { getByTestId } = render(
      <KeyboardView androidBehavior={androidBehavior} iosBehavior={iosBehavior}>
        {children}
      </KeyboardView>
    )
    const keyboardView = getByTestId(KEYBOARD_AVOIDING_VIEW_TEST_ID)

    expect(screen.getByText('Content')).toBeTruthy()
    expect(keyboardView).toBeDefined()
    expect(screen.toJSON()).toMatchSnapshot()
  })
})
