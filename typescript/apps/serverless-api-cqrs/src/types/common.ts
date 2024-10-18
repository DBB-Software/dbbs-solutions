/**
 * Type representing an acknowledgement response.
 * @typedef {Object} AcknowledgementResponse
 * @property {string} status - The status of the response.
 *
 * Represents the response status for an acknowledgement.
 */
export type AcknowledgementResponse = {
  status: string
}

/**
 * Interface representing an event.
 * @interface Event
 *
 * Represents a generic event structure with a method to serialize it to JSON.
 */
export type Event = {
  constructor: {
    name: string
  }
  toJson(): { [key: string]: unknown }
}

/**
 * Type representing a stored event.
 * @typedef {Object} StoredEvent
 * @property {string} eventName - The name of the event.
 * @property {{ [key: string]: unknown }} eventBody - The body of the event.
 *
 * Represents an event that has been stored in the event store.
 */
export type StoredEvent = {
  eventName: string
  eventBody: { [key: string]: unknown }
}
