import { toast } from 'react-toastify'

export type ValidationError = {
  type: string
  loc: string[]
  msg: string
  input: unknown
}

export const displayValidationErrors = (response: { status: number; data: { detail: Array<ValidationError> } }) => {
  const { data } = response

  if (data && data.detail && typeof data.detail === 'string') {
    toast.error(data.detail)
    return
  }

  if (!data || !Array.isArray(data.detail) || data.detail.length === 0) {
    toast.error('An unexpected error occurred.')
    return
  }

  const errors = data.detail

  errors.forEach((error) => {
    if (error.loc && error.msg) {
      const fieldPath = error.loc.filter((location) => location !== 'body').join('.')
      const message = `${error.msg}: ${fieldPath}`

      toast.error(message)
    } else {
      toast.error('An error occurred, but details are unavailable.')
    }
  })
}
