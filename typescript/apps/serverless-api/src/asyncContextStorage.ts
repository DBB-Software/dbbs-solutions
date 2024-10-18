/**
 * Module representing the asynchronous context storage.
 * @module AsyncContextStorage
 */

import { AsyncLocalStorage } from 'async_hooks'

/**
 * Represents the asynchronous local storage for context propagation.
 * @type {AsyncLocalStorage}
 */
export const asyncContextStorage = new AsyncLocalStorage()
