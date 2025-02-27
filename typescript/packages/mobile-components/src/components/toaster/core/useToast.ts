import { useCallback, useMemo } from 'react'
import {
  resolveValue,
  type Renderable,
  type ToastOptions,
  type ToastType,
  type DefaultToastOptions,
  type ValueOrFunction,
  type Toast
} from './types'
import { useStore } from './useStore'

type Message = ValueOrFunction<Renderable, Toast>
type ToastHandler = (message: Message, options?: ToastOptions) => string

const genId = (() => {
  let count = 0
  return () => (++count).toString()
})()

const createToast = (message: Message, type: ToastType = 'blank', opts?: ToastOptions) => ({
  createdAt: Date.now(),
  visible: true,
  type,
  message,
  pauseDuration: 0,
  height: 50,
  ...opts,
  id: opts?.id || genId()
})

export const useToast = () => {
  const { upsertToast, dismissToast, removeToast } = useStore()

  const createHandler = useCallback(
    (type?: ToastType): ToastHandler =>
      (message, options) => {
        const toast = createToast(message, type, options)
        upsertToast(toast)
        return toast.id
      },
    [upsertToast]
  )

  const blank = useMemo(() => createHandler('blank'), [createHandler])
  const error = useMemo(() => createHandler('error'), [createHandler])
  const success = useMemo(() => createHandler('success'), [createHandler])
  const loading = useMemo(() => createHandler('loading'), [createHandler])
  const custom = useMemo(() => createHandler('custom'), [createHandler])

  const dismiss = useCallback(
    (toastId?: string) => {
      dismissToast(toastId)
    },
    [dismissToast]
  )

  const remove = useCallback(
    (toastId?: string) => {
      removeToast(toastId)
    },
    [removeToast]
  )

  const promise = useCallback(
    <T>(
      _promise: Promise<T>,
      msgs: {
        loading: Renderable
        success: ValueOrFunction<Renderable, T>
        error: ValueOrFunction<Renderable, unknown>
      },
      opts?: DefaultToastOptions
    ) => {
      const id = loading(msgs.loading, { ...opts, ...opts?.loading })

      _promise
        .then((result) => {
          success(resolveValue(msgs.success, result), {
            id,
            ...opts,
            ...opts?.success
          })
          return result
        })
        .catch((_error) => {
          error(resolveValue(msgs.error, _error), {
            id,
            ...opts,
            ...opts?.error
          })
        })

      return _promise
    },
    [error, loading, success]
  )

  return { blank, error, success, loading, custom, dismiss, remove, promise }
}
