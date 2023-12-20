import { StatusCodes } from 'http-status-codes'

import { HttpErrorBase } from './httpErrorBase.js'

export class NotFoundError extends HttpErrorBase {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options, StatusCodes.NOT_FOUND)

    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}
