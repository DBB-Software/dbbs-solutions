import { useState } from 'react'
import { Button, View } from 'react-native'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { renderHook, act } from '@testing-library/react-hooks'
import { BottomHalfModal } from '../../src'

describe('Bottom half modal Component', () => {
  it('renders correctly with default settings', async () => {
    const { result } = renderHook(() => {
      const [isOpen, setIsOpen] = useState(true)
      return { isOpen, setIsOpen }
    })
    const onClose = () => result.current.setIsOpen(false)
    const renderProps = {
      isOpen: result.current.isOpen,
      onClose,
      children: <View />
    }

    const { getByTestId } = render(
      <View>
        <Button title="Close" testID="close-button" onPress={onClose} />
        <BottomHalfModal {...renderProps} />
      </View>
    )

    expect(result.current.isOpen).toBe(true)
    act(() => fireEvent.press(getByTestId('close-button')))
    await waitFor(() => expect(result.current.isOpen).toBe(false))
  })
})
