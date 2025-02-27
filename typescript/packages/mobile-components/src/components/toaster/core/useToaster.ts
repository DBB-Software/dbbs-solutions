import { useCallback, useMemo } from 'react'
import { useStore } from './useStore'
import type { DefaultToastOptions, Toast } from './types'

export const useToaster = (toastOptions?: DefaultToastOptions) => {
  const { toasts, startPause, endPause } = useStore(toastOptions)

  const calculateOffset = useCallback(
    (
      toast: Toast,
      opts?: {
        gutter?: number
      }
    ) => {
      const { gutter = 8 } = opts || {}

      const relevantToasts = toasts.filter((t) => t.position === toast.position && t.height)

      const toastIndex = relevantToasts.findIndex((t) => t.id === toast.id)
      const toastsBefore = relevantToasts.filter((t, i) => i < toastIndex && t.visible).length

      const offset = relevantToasts
        .filter((t) => t.visible)
        .slice(...[0, toastsBefore])
        .reduce((acc, t) => acc + (t.height || 0) + gutter, 0)

      return offset
    },
    [toasts]
  )

  const handlers = useMemo(
    () => ({
      startPause,
      endPause,
      calculateOffset
    }),
    [startPause, endPause, calculateOffset]
  )

  return {
    toasts,
    handlers
  }
}
