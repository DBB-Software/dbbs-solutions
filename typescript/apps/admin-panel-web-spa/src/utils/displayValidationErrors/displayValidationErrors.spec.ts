import { toast } from 'react-toastify'
import { displayValidationErrors, ValidationError } from './displayValidationErrors'

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn()
  }
}))

describe('displayValidationErrors', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should display a generic error message when detail array is empty', () => {
    const response = { status: 400, data: { detail: [] } }

    displayValidationErrors(response)

    expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred.')
  })

  it('should display error messages for each validation error', () => {
    const errors: ValidationError[] = [
      { type: 'type_error', loc: ['body', 'email'], msg: 'Invalid email', input: 'invalid-email' },
      { type: 'value_error', loc: ['body', 'password'], msg: 'Password too short', input: '123' }
    ]
    const response = { status: 422, data: { detail: errors } }

    displayValidationErrors(response)

    expect(toast.error).toHaveBeenCalledTimes(2)
    expect(toast.error).toHaveBeenNthCalledWith(1, 'Invalid email: email')
    expect(toast.error).toHaveBeenNthCalledWith(2, 'Password too short: password')
  })

  it('should handle errors with missing loc or msg gracefully', () => {
    const errors: ValidationError[] = [{ type: 'type_error', loc: [], msg: '', input: null }]
    const response = { status: 422, data: { detail: errors } }

    displayValidationErrors(response)

    expect(toast.error).toHaveBeenCalledWith('An error occurred, but details are unavailable.')
  })

  it('should ignore the first element of loc when generating fieldPath', () => {
    const errors: ValidationError[] = [
      { type: 'type_error', loc: ['body', 'user', 'name'], msg: 'Invalid name', input: 'invalid' }
    ]
    const response = { status: 422, data: { detail: errors } }

    displayValidationErrors(response)

    expect(toast.error).toHaveBeenCalledWith('Invalid name: user.name')
  })
})
