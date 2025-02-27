import { atom, useAtom } from '@dbbs/mobile-jotai-storage'
import { useCallback } from 'react'
import type { DefaultToastOptions, Toast } from './types'

export const toastsAtom = atom<Toast[]>([])
export const pausedAtAtom = atom<number | null>(null)

export const TOAST_EXPIRE_DISMISS_DELAY = 500

const DEFAULT_TOAST_DURATION_DELAY = 5000

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

export const useStore = (toastOptions?: DefaultToastOptions) => {
  const [toasts, setToasts] = useAtom(toastsAtom)
  const [pausedAt, setPausedAt] = useAtom(pausedAtAtom)

  const addToast = useCallback(
    (toast: Toast) => {
      setToasts((prev) => [toast, ...prev])
    },
    [setToasts]
  )

  const removeToast = useCallback(
    (toastId?: string) => {
      setToasts((prev) => (toastId ? prev.filter((t) => t.id !== toastId) : []))
    },
    [setToasts]
  )

  const addToRemoveQueue = useCallback(
    (toastId: string) => {
      if (toastTimeouts.has(toastId)) return

      const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId)
        removeToast(toastId)
      }, TOAST_EXPIRE_DISMISS_DELAY)

      toastTimeouts.set(toastId, timeout)
    },
    [removeToast]
  )

  const clearFromRemoveQueue = useCallback((toastId: string) => {
    const timeout = toastTimeouts.get(toastId)
    if (timeout) clearTimeout(timeout)
  }, [])

  const updateToast = useCallback(
    (updatedToast: Partial<Toast>) => {
      if (updatedToast.id) {
        clearFromRemoveQueue(updatedToast.id)
      }
      setToasts((prev) => prev.map((t) => (t.id === updatedToast.id ? { ...t, ...updatedToast } : t)))
    },
    [clearFromRemoveQueue, setToasts]
  )

  const dismissToast = useCallback(
    (toastId?: string) => {
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        toasts.forEach((toast) => addToRemoveQueue(toast.id))
      }
      setToasts((prev) => prev.map((t) => (t.id === toastId || !toastId ? { ...t, visible: false } : t)))
    },
    [addToRemoveQueue, setToasts, toasts]
  )

  const upsertToast = useCallback(
    (toast: Toast) => {
      const newToast: Toast = {
        ...toastOptions,
        ...toastOptions?.[toast.type],
        ...toast,
        duration:
          toast.duration ||
          toastOptions?.[toast.type]?.duration ||
          toastOptions?.duration ||
          DEFAULT_TOAST_DURATION_DELAY,
        style: {
          ...toastOptions?.style,
          ...toastOptions?.[toast.type]?.style,
          ...toast.style
        }
      }

      if (!pausedAt) {
        const now = Date.now()
        const durationLeft = (newToast.duration || 0) + newToast.pauseDuration - (now - newToast.createdAt)
        setTimeout(() => dismissToast(newToast.id), durationLeft)
      }

      setToasts((prev) =>
        prev.find((t) => t.id === newToast.id)
          ? prev.map((t) => (t.id === newToast.id ? { ...t, ...newToast } : t))
          : [newToast, ...prev]
      )
    },
    [dismissToast, pausedAt, setToasts, toastOptions]
  )

  const startPause = useCallback(() => setPausedAt(Date.now()), [setPausedAt])

  const endPause = useCallback(() => {
    const diff = Date.now() - (pausedAt || 0)
    setPausedAt(null)

    setToasts((prev) =>
      prev.map((t) => ({
        ...t,
        pauseDuration: (t.pauseDuration || 0) + diff
      }))
    )
  }, [pausedAt, setPausedAt, setToasts])

  return {
    toasts,
    pausedAt,
    addToast,
    updateToast,
    upsertToast,
    dismissToast,
    removeToast,
    startPause,
    endPause
  }
}
