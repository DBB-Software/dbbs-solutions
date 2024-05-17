import React from 'react'
import { Text } from 'react-native'
import { render, fireEvent } from '@testing-library/react-native'
import { SmoothSlideTrack } from '../../src/components'

describe('SmoothSlideTrack', () => {
  const data = ['Item 1', 'Item 2', 'Item 3']
  const itemWidth = 100

  it('renders correctly with initial data', () => {
    const { getByText } = render(
      <SmoothSlideTrack data={data} itemWidth={itemWidth} renderItem={(item) => <Text>{item}</Text>} />
    )

    data.forEach((item) => {
      expect(getByText(item)).toBeDefined()
    })
  })

  it('swipes to the next item on touch swipe', () => {
    const { getByTestId, getByText } = render(
      <SmoothSlideTrack data={data} itemWidth={itemWidth} renderItem={(item) => <Text>{item}</Text>} />
    )

    const track = getByTestId('smooth-slide-track')

    // Simulate swipe to the left
    fireEvent(track, 'pan', { translationX: -itemWidth })
    expect(getByText('Item 2')).toBeDefined()

    // Simulate swipe to the left again
    fireEvent(track, 'pan', { translationX: -itemWidth })
    expect(getByText('Item 3')).toBeDefined()

    // Simulate touch down to stop auto play
    fireEvent(track, 'touchStart')
    // Simulate touch up to resume auto play
    fireEvent(track, 'touchEnd')
  })
})
