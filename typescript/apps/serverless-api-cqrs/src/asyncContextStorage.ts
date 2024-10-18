import { AsyncLocalStorage } from 'async_hooks'

/**
 * Async local storage for maintaining context across asynchronous operations.
 * @type {AsyncLocalStorage}
 */
export const asyncContextStorage = new AsyncLocalStorage()
