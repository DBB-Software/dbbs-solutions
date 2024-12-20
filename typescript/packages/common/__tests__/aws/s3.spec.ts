import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import AWSXRayCore from 'aws-xray-sdk-core'
import { PassThrough } from 'stream'
import { CustomS3Handler } from '../../src/aws/s3.js'

jest.mock('@aws-sdk/client-s3', () => ({
  ...jest.requireActual('@aws-sdk/client-s3'),
  S3Client: jest.fn().mockImplementation(() => {
    return { send: jest.fn() }
  })
}))

jest.mock('stream', () => ({
  ...jest.requireActual('stream'),
  PassThrough: jest.fn()
}))

jest.mock('@aws-sdk/lib-storage', () => ({
  ...jest.requireActual('@aws-sdk/lib-storage'),
  Upload: jest.fn().mockImplementation(({}) => ({
    done: jest.fn().mockResolvedValue({ ETag: 'mocked-etag' })
  }))
}))

jest.mock('aws-xray-sdk-core', () => ({
  captureAWSv3Client: jest.fn()
}))

describe('CustomS3Handler', () => {
  const mockedRegion: string = 'eu-central-1'
  const mockedBucket: string = 'test-bucket'
  const mockedBucketKey: string = 'test-key'
  const mockedData: object = { key: 'value' }
  const mockedPrefix: string = 'test-prefix'
  const mockedContentType: string = 'application/json'
  const mockedDefaultContentType: string = 'application/octet-stream'
  const mockedAcl = undefined
  const mockedCacheControl: string = 'no-cache'

  afterEach(jest.clearAllMocks)

  describe('constructor (S3 Client Initialize)', () => {
    test.each([
      {
        description: 'should initialize S3 client instance with X-Ray',
        region: mockedRegion,
        enableXRay: true,
        expectedCalls: 1,
        expectedCallInput: { region: mockedRegion, apiVersion: 'latest' }
      },
      {
        description: 'should initialize S3 client instance without X-Ray',
        region: mockedRegion,
        enableXRay: false,
        expectedCalls: 0,
        expectedCallInput: { region: mockedRegion, apiVersion: 'latest' }
      }
    ])('$description', async ({ enableXRay, expectedCalls, expectedCallInput }) => {
      new CustomS3Handler(mockedRegion, false, enableXRay)

      expect(AWSXRayCore.captureAWSv3Client).toBeCalledTimes(expectedCalls)
      expect(S3Client).toHaveBeenCalledWith(expectedCallInput)
    })
  })

  describe('getObject', () => {
    test.each([
      {
        description: 'should get object from S3 with correct input params',
        input: { bucket: mockedBucket, key: mockedBucketKey },
        expectedCallInput: {
          Bucket: mockedBucket,
          Key: mockedBucketKey
        }
      },
      {
        description: 'should get object from S3 with wrong input params',
        input: { bucket: null, key: null } as any,
        expectedCallInput: { Bucket: null, Key: null }
      }
    ])('$description', async ({ input, expectedCallInput }) => {
      const s3Handler = new CustomS3Handler(mockedRegion)
      await s3Handler.getObject(input)

      expect(s3Handler.client.send).toHaveBeenCalled()
      expect(s3Handler.client.send).toHaveBeenCalledWith(expect.objectContaining({ input: expectedCallInput }))
    })
  })

  describe('uploadJSONtoS3', () => {
    test.each([
      {
        description: 'should upload JSON data to S3 with correct input params',
        input: { data: mockedData, bucket: mockedBucket, key: mockedBucketKey },
        expectedCallInput: {
          Bucket: mockedBucket,
          Key: mockedBucketKey,
          Body: JSON.stringify(mockedData),
          ContentType: mockedContentType
        }
      },
      {
        description: 'should upload JSON data to S3 with wrong input params',
        input: { data: null, key: null, bucket: null } as any,
        expectedCallInput: {
          Bucket: null,
          Key: null,
          Body: undefined,
          ContentType: mockedContentType
        }
      }
    ])('$description', async ({ input, expectedCallInput }) => {
      const s3Handler = new CustomS3Handler(mockedRegion)
      await s3Handler.uploadJSONtoS3(input)

      expect(s3Handler.client.send).toHaveBeenCalled()
      expect(s3Handler.client.send).toHaveBeenCalledWith(expect.objectContaining({ input: expectedCallInput }))
    })
  })

  describe('downloadJSONfromS3', () => {
    test.each([
      {
        description: 'should return parsed object from S3',
        input: { bucket: mockedBucket, key: mockedBucketKey },
        expectedCallInput: { bucket: mockedBucket, key: mockedBucketKey },
        expectedGetObjectResult: JSON.stringify(mockedData),
        expectedResult: mockedData
      }
    ])('$description', async ({ input, expectedCallInput, expectedGetObjectResult, expectedResult }) => {
      const s3Handler = new CustomS3Handler(mockedRegion)

      s3Handler.getObject = jest.fn().mockResolvedValue({
        Body: {
          transformToString: jest.fn().mockResolvedValue(expectedGetObjectResult)
        }
      })
      const result = await s3Handler.downloadJSONfromS3(input)
      expect(result).toStrictEqual(expectedResult)
      expect(s3Handler.getObject).toHaveBeenCalled()
      expect(s3Handler.getObject).toHaveBeenCalledWith(expectedCallInput)
    })
  })

  describe('getObjectsList', () => {
    test.each([
      {
        description: 'should get list of keys from S3 with correct input params',
        input: { bucket: mockedBucket, prefix: mockedPrefix },
        expectedCallInput: {
          Bucket: mockedBucket,
          Prefix: mockedPrefix
        }
      },
      {
        description: 'should get list of keys from S3 with wrong input params',
        input: { bucket: null, prefix: null } as any,
        expectedCallInput: {
          Bucket: null,
          Prefix: null
        }
      }
    ])('$description', async ({ input, expectedCallInput }) => {
      const s3Handler = new CustomS3Handler(mockedRegion)
      await s3Handler.getObjectsList(input)

      expect(s3Handler.client.send).toHaveBeenCalled()
      expect(s3Handler.client.send).toHaveBeenCalledWith(expect.objectContaining({ input: expectedCallInput }))
    })
  })

  describe('uploadFileStream', () => {
    test.each([
      {
        description: 'should upload file stream with correct input params to S3',
        input: {
          bucket: mockedBucket,
          key: mockedBucketKey,
          contentType: mockedContentType,
          acl: mockedAcl,
          cacheControl: mockedCacheControl
        },
        expectedCallInput: {
          Bucket: mockedBucket,
          Key: mockedBucketKey,
          ContentType: mockedContentType,
          ACL: mockedAcl,
          CacheControl: mockedCacheControl,
          Body: {}
        }
      },
      {
        description: 'should upload file stream with correct input params and default Content Type to S3',
        input: {
          bucket: mockedBucket,
          key: mockedBucketKey,
          acl: mockedAcl,
          cacheControl: mockedCacheControl
        },
        expectedCallInput: {
          Bucket: mockedBucket,
          Key: mockedBucketKey,
          ContentType: mockedDefaultContentType,
          ACL: mockedAcl,
          CacheControl: mockedCacheControl,
          Body: {}
        }
      },
      {
        description: 'should upload file stream with wrong input params and default Content Type to S3',
        input: {
          bucket: null,
          key: null,
          acl: null,
          cacheControl: null
        } as any,
        expectedCallInput: {
          Bucket: null,
          Key: null,
          ContentType: mockedDefaultContentType,
          ACL: null,
          CacheControl: null,
          Body: {}
        }
      }
    ])('$description', async ({ input, expectedCallInput }) => {
      const s3Handler = new CustomS3Handler(mockedRegion)
      const result = await s3Handler.uploadFileStream(input)

      expect(PassThrough).toHaveBeenCalled()
      expect(Upload).toHaveBeenCalledWith({
        client: s3Handler.client,
        params: expect.objectContaining(expectedCallInput)
      })
      await expect(result.promise).resolves.toEqual({ ETag: 'mocked-etag' })
      expect(result.writeStream).toBeInstanceOf(PassThrough)
    })
  })
})
