import { StatusCodes } from 'http-status-codes'
import { HttpErrorBase } from './httpErrorBase.js'

/**
 * Error class for processing errors.
 * @class
 * @extends {HttpErrorBase}
 */
export class ProcessingError extends HttpErrorBase {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options, StatusCodes.BAD_GATEWAY)
    Object.setPrototypeOf(this, ProcessingError.prototype)
  }
}
