import { renderHook, act } from '@testing-library/react-hooks'
import { useStore } from '../../src/components/toaster/core/useStore'
import { useToaster } from '../../src/components/toaster/core/useToaster'
import { type Toast, useToast } from '../../src'

jest.useFakeTimers()

type MockedToastType = Omit<Toast, 'id' | 'duration' | 'style'> & { duration: number; style: object }

const DEFAULT_TOAST_HEIGHT = 50

const mockedToast: MockedToastType = {
  type: 'success',
  message: 'Test Toast Message',
  createdAt: Date.now(),
  visible: true,
  pauseDuration: 0,
  duration: 5000,
  position: 'top',
  style: { backgroundColor: '#f5f5f5' },
  height: DEFAULT_TOAST_HEIGHT
}

const makeToast = (id: string) => ({ id, ...mockedToast })

describe('useStore Hook', () => {
  it('should add a toast', () => {
    const { result } = renderHook(() => useStore())
    const testToastOne = makeToast('1')
    act(() => {
      result.current.addToast(testToastOne)
    })
    expect(result.current.toasts).toEqual([testToastOne])
  })

  it('should remove a toast by ID', () => {
    const { result } = renderHook(() => useStore())
    const testToastOne = makeToast('1')
    act(() => {
      result.current.addToast(testToastOne)
      result.current.removeToast('1')
    })
    expect(result.current.toasts).toEqual([])
  })

  it('should dismiss all toasts', () => {
    const { result } = renderHook(() => useStore())
    const testToastOne = makeToast('1')
    const testToastTwo = makeToast('2')
    act(() => {
      result.current.addToast(testToastOne)
      result.current.addToast(testToastTwo)
      result.current.dismissToast()
    })
    expect(result.current.toasts.every((t) => !t.visible)).toBe(true)
  })
})

describe('useToast Hook', () => {
  it('should create a blank toast', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      const id = result.current.blank('Test Blank Toast')
      expect(id).toBeTruthy()
    })
  })

  it('should create an error toast', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      const id = result.current.error('Test Error Toast')
      expect(id).toBeTruthy()
    })
  })

  it('should handle promise correctly', async () => {
    const promise = Promise.resolve('Success!')
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.promise(promise, {
        loading: 'Loading...',
        success: 'Loaded successfully!',
        error: 'Error occurred!'
      })
    })

    expect(result.current.success).toBeDefined()
  })
})

describe('useToaster Hook', () => {
  it('should auto-dismiss a toast after duration', () => {
    const { result } = renderHook(() => useToaster())
    const testToastOne = makeToast('1')
    act(() => {
      result.current.toasts.push(testToastOne)
    })
    act(() => {
      jest.advanceTimersByTime(1001)
    })
    expect(result.current.toasts.every((t) => !t.visible)).toBe(false)
  })

  it('should calculate correct toast offset', () => {
    const { result } = renderHook(() => useToaster())
    const testToastOne = makeToast('1')
    const gutter = 8

    act(() => {
      result.current.toasts.push(testToastOne)
    })
    const offset = result.current.handlers.calculateOffset(testToastOne, { gutter })
    expect(offset).toBe(DEFAULT_TOAST_HEIGHT + gutter)
  })
})
