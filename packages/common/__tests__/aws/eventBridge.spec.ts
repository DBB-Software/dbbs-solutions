import { EventBridgeClient, PutEventsRequestEntry } from '@aws-sdk/client-eventbridge'
import AWSXRayCore from 'aws-xray-sdk-core'
import { CustomEventBridgeHandler } from '../../src/aws/eventBridge.js'

jest.mock('@aws-sdk/client-eventbridge', () => ({
  ...jest.requireActual('@aws-sdk/client-eventbridge'),
  EventBridgeClient: jest.fn().mockImplementation(() => {
    return { send: jest.fn() }
  })
}))

jest.mock('aws-xray-sdk-core', () => ({
  captureAWSv3Client: jest.fn()
}))

describe('CustomEventBridgeHandler', () => {
  const mockedRegion: string = 'eu-central-1'
  const mockedEntries: PutEventsRequestEntry[] = [
    { Source: 'test-source', DetailType: 'type', Detail: '{"key": "value"}' }
  ]

  afterEach(jest.clearAllMocks)

  describe('constructor (Event Bridge Client Initialize)', () => {
    test.each([
      {
        description: 'should initialize Event Bridge client instance with X-Ray',
        region: mockedRegion,
        enableXRay: true,
        expectedCalls: 1,
        expectedCallInput: { region: mockedRegion, apiVersion: 'latest' }
      },
      {
        description: 'should initialize Event Bridge client instance without X-Ray',
        region: mockedRegion,
        enableXRay: false,
        expectedCalls: 0,
        expectedCallInput: { region: mockedRegion, apiVersion: 'latest' }
      }
    ])('$description', async ({ enableXRay, expectedCalls, expectedCallInput }) => {
      new CustomEventBridgeHandler(mockedRegion, enableXRay)

      expect(AWSXRayCore.captureAWSv3Client).toBeCalledTimes(expectedCalls)
      expect(EventBridgeClient).toHaveBeenCalledWith(expectedCallInput)
    })
  })

  describe('publishToEventBridge', () => {
    test.each([
      {
        description: 'should publish events to event bridge with corrent input params',
        input: mockedEntries,
        expectedCallInput: mockedEntries
      },
      {
        description: 'should pass publish events to event bridge with empty entries params',
        input: [],
        expectedCallInput: []
      },
      {
        description: 'should pass publish events to event bridge with null entries param',
        input: null as any,
        expectedCallInput: null
      }
    ])('$description', async ({ input, expectedCallInput }) => {
      const eventBridgeHandler = new CustomEventBridgeHandler(mockedRegion)
      await eventBridgeHandler.publishToEventBridge(input)

      expect(eventBridgeHandler.client.send).toHaveBeenCalled()
      expect(eventBridgeHandler.client.send).toHaveBeenCalledWith(
        expect.objectContaining({ input: { Entries: expectedCallInput } })
      )
    })
  })
})
