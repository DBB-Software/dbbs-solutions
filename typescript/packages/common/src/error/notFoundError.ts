import { StatusCodes } from 'http-status-codes'
import { HttpErrorBase } from './httpErrorBase.js'

/**
 * Error class for not found errors.
 * @class
 * @extends {HttpErrorBase}
 */
export class NotFoundError extends HttpErrorBase {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options, StatusCodes.NOT_FOUND)
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}
