import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { CustomButton, CustomButtonProps, DEFAULT_CUSTOM_BUTTON_TEST_ID } from '../../src'

const DEFAULT_TEST_ID = DEFAULT_CUSTOM_BUTTON_TEST_ID
const DEFAULT_TEXT = 'Text'
const DEFAULT_ON_PRESS = () => console.log('onPress')
const LOADING_TEXT = 'Loading Text'

const CUSTOM_BUTTON_DEFAULT_STATE: CustomButtonProps = {
  text: DEFAULT_TEXT,
  onPress: DEFAULT_ON_PRESS
}

const CUSTOM_BUTTON_LOADING_STATE: CustomButtonProps = {
  text: DEFAULT_TEXT,
  onPress: DEFAULT_ON_PRESS,
  isLoading: true,
  loadingText: LOADING_TEXT
}

const CUSTOM_BUTTON_DISABLED_STATE: CustomButtonProps = {
  ...CUSTOM_BUTTON_LOADING_STATE,
  isLoading: false,
  isDisabled: true
}

describe('Button Component', () => {
  it('renders correctly with default settings', () => {
    render(<CustomButton {...CUSTOM_BUTTON_DEFAULT_STATE} />)

    expect(screen.getByTestId(DEFAULT_TEST_ID)).toBeTruthy()
  })

  it('renders correctly with loading state', () => {
    render(<CustomButton {...CUSTOM_BUTTON_LOADING_STATE} />)

    expect(screen.getByTestId(DEFAULT_TEST_ID).props.accessibilityState.disabled).toBe(true)
    expect(screen.getByText(LOADING_TEXT)).toBeTruthy()
  })

  it('renders correctly with disabled state', () => {
    render(<CustomButton {...CUSTOM_BUTTON_DISABLED_STATE} />)

    expect(screen.getByTestId(DEFAULT_TEST_ID).props.accessibilityState.disabled).toBe(true)
    expect(screen.getByText(DEFAULT_TEXT)).toBeTruthy()
  })

  it('renders the correct onPress action', async () => {
    const mockCallBack = jest.fn()

    render(<CustomButton {...CUSTOM_BUTTON_DEFAULT_STATE} onPress={mockCallBack} />)

    expect(screen.getByTestId(DEFAULT_TEST_ID)).toBeTruthy()

    fireEvent.press(screen.getByTestId(DEFAULT_TEST_ID))

    expect(mockCallBack.mock.calls.length).toEqual(1)
  })
})
