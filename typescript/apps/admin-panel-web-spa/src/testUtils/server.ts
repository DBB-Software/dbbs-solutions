import { setupServer } from 'msw/node'
import { productHandlers, typeHandlers } from './handlers'

export const mswServer = setupServer(...productHandlers, ...typeHandlers)
