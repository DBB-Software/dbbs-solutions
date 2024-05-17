import { StatusCodes } from 'http-status-codes'

/**
 * Interface for HTTP errors.
 * @interface
 */
export interface IHttpError extends Error {
  statusCode?: number
}

/**
 * Base class for HTTP errors.
 * @abstract
 * @class
 * @implements {IHttpError}
 */
export abstract class HttpErrorBase extends Error implements IHttpError {
  statusCode: number

  /**
   * Creates an instance of HttpErrorBase.
   * @constructor
   * @param {string} message - The error message.
   * @param {ErrorOptions} [options] - Options for the error.
   * @param {number} [statusCode=StatusCodes.INTERNAL_SERVER_ERROR] - The HTTP status code.
   */
  constructor(message: string, options?: ErrorOptions, statusCode?: number) {
    super(message)
    this.statusCode = statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR
    Object.setPrototypeOf(this, HttpErrorBase.prototype)
  }
}
