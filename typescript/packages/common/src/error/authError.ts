import { StatusCodes } from 'http-status-codes'
import { HttpErrorBase } from './httpErrorBase.js'

/**
 * Error class for authentication issues.
 * @class
 * @extends {HttpErrorBase}
 */
export class AuthError extends HttpErrorBase {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options, StatusCodes.FORBIDDEN)
    Object.setPrototypeOf(this, AuthError.prototype)
  }
}
