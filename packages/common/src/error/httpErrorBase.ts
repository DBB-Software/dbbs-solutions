import { StatusCodes } from 'http-status-codes'

export interface IHttpError extends Error {
  statusCode?: number
}

export abstract class HttpErrorBase extends Error implements IHttpError {
  statusCode: number

  constructor(message: string, options?: ErrorOptions, statusCode?: number) {
    super(message)
    this.statusCode = statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR
    Object.setPrototypeOf(this, HttpErrorBase.prototype)
  }
}
