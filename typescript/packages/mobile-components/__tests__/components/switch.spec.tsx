import React, { useState } from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { renderHook, act } from '@testing-library/react-hooks'
import { PlatformSwitch } from '../../src'

describe('PlatformSwitch', () => {
  it('renders correctly with default settings', async () => {
    const { result } = renderHook(() => {
      const [isActive, setIsActive] = useState(false)
      return { isActive, setIsActive }
    })
    const onToggle = () => result.current.setIsActive(!result.current.isActive)

    render(<PlatformSwitch value={result.current.isActive} onValueChange={onToggle} />)

    expect(result.current.isActive).toBe(false)
    act(() => onToggle())
    await waitFor(() => expect(result.current.isActive).toBe(true))
  })
  it('does not toggle when disabled and applies disabled styles', async () => {
    const { result } = renderHook(() => {
      const [isActive, setIsActive] = useState(false)
      return { isActive, setIsActive }
    })
    const onToggle = () => result.current.setIsActive(!result.current.isActive)

    const disabledContainerStyle = {
      backgroundColor: 'gray',
      justifyContent: 'center' as 'center',
      paddingHorizontal: 0,
      borderRadius: 0,
      height: 0,
      width: 50
    }
    const disabledToggleStyle = {
      backgroundColor: 'darkgray',
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      borderRadius: 0,
      transform: [{ translateX: 0 }],
      height: 0,
      width: 0
    }

    const { getByTestId } = render(
      <PlatformSwitch
        value={result.current.isActive}
        onValueChange={onToggle}
        isDisabled={true}
        disabledContainerStyle={disabledContainerStyle}
        disabledToggleStyle={disabledToggleStyle}
      />
    )

    const container = getByTestId('switch-container')
    const toggle = getByTestId('switch-toggle')

    // Check if the disabled styles are applied
    expect(container.props.style).toEqual(disabledContainerStyle)
    expect(toggle.props.style).toEqual(disabledToggleStyle)

    // Try to toggle the switch
    fireEvent.press(container)

    // Check that the value has not changed
    expect(result.current.isActive).toBe(false)
  })
})
