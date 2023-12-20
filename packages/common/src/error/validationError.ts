import { StatusCodes } from 'http-status-codes'

import { HttpErrorBase } from './httpErrorBase.js'

export class ValidationError extends HttpErrorBase {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options, StatusCodes.UNPROCESSABLE_ENTITY)

    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}
