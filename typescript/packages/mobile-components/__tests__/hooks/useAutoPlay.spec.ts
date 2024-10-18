import { renderHook, act } from '@testing-library/react-hooks'
import { useAutoPlay } from '../../src/hooks'

const BASE_AUTO_PLAY_INTERVAL = 1000

jest.useFakeTimers()

describe('useAutoPlay', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should start autoPlay when autoPlay is true', () => {
    const onStart = jest.fn()
    renderHook(() => useAutoPlay({ onStart }))

    act(() => {
      jest.advanceTimersByTime(BASE_AUTO_PLAY_INTERVAL)
    })

    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('should not start autoPlay when autoPlay is false', () => {
    const onStart = jest.fn()
    renderHook(() => useAutoPlay({ autoPlay: false, onStart }))

    act(() => {
      jest.advanceTimersByTime(BASE_AUTO_PLAY_INTERVAL)
    })

    expect(onStart).not.toHaveBeenCalled()
  })

  it('should stop autoPlay when stop function is called', () => {
    const onStart = jest.fn()
    const onStop = jest.fn()
    const { result } = renderHook(() => useAutoPlay({ onStart, onStop }))

    act(() => {
      result.current.stop()
      jest.advanceTimersByTime(BASE_AUTO_PLAY_INTERVAL)
    })

    expect(onStop).toHaveBeenCalledTimes(1)
    expect(onStart).not.toHaveBeenCalled()
  })

  it('should restart autoPlay when play function is called after stopping', () => {
    const onStart = jest.fn()
    const onStop = jest.fn()
    const { result } = renderHook(() => useAutoPlay({ onStart, onStop }))

    act(() => {
      result.current.stop()
      jest.advanceTimersByTime(BASE_AUTO_PLAY_INTERVAL)
    })

    expect(onStop).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.play()
      jest.advanceTimersByTime(BASE_AUTO_PLAY_INTERVAL)
    })

    expect(onStart).toHaveBeenCalledTimes(1)
  })
})
