import { setupServer } from 'msw/node'
import { geoHandlers, meetingTypeHandlers } from './handlers'

export const mswServer = setupServer(...geoHandlers, ...meetingTypeHandlers)
