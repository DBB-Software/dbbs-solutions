import { StatusCodes } from 'http-status-codes'
import { HttpErrorBase } from './httpErrorBase.js'

/**
 * Error class for bad arguments.
 * @class
 * @extends {HttpErrorBase}
 */
export class ArgumentError extends HttpErrorBase {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options, StatusCodes.BAD_REQUEST)
    Object.setPrototypeOf(this, ArgumentError.prototype)
  }
}
