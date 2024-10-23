import {
  GetObjectCommand,
  GetObjectCommandOutput,
  ListObjectsCommand,
  ListObjectsCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
  S3ClientConfig
} from '@aws-sdk/client-s3'
import AWSXRayCore from 'aws-xray-sdk-core'
import { PassThrough } from 'stream'
import { isJSONString } from '../helpers.js'
import {
  IDownloadJsonFromS3Input,
  IDownloadJsonFromS3Output,
  IGetObjectFromS3Input,
  IGetObjectsListInput,
  IUploadFileStreamInput,
  IUploadJsonToS3Input
} from './types/s3.js'

/**
 * Provides a unified interface to perform various operations on Amazon S3, such as retrieving,
 * uploading, and downloading objects. It supports integration with AWS X-Ray to trace and analyze AWS SDK operations.
 */
export class CustomS3Handler {
  client: S3Client

  localStackEndpoint: string = 'http://127.0.0.1:4566'

  /**
   * Constructs the S3 handler, optionally using a local S3 endpoint for development and testing.
   * Enables AWS X-Ray for tracing AWS SDK calls if specified.
   * @constructor
   * @param {string} region The AWS region where the S3 bucket is located.
   * @param {boolean} [local=false] Indicates whether to use LocalStack for local S3 API simulation.
   * @param {boolean} [enableXRay=false] Indicates whether to enable AWS X-Ray for request tracing.
   */
  constructor(region: string, local: boolean = false, enableXRay: boolean = false) {
    const endpoint = local ? this.localStackEndpoint : undefined
    const params: S3ClientConfig = {
      region,
      apiVersion: 'latest',
      endpoint
    }
    const client = new S3Client(params)
    this.client = enableXRay ? AWSXRayCore.captureAWSv3Client(client) : client
  }

  /**
   * Retrieves an object from Amazon S3 using specified bucket and key.
   * @async
   * @param {IGetObjectFromS3Input} params Parameters including the bucket and object key.
   * @returns {Promise<GetObjectCommandOutput>} A promise resolving to the output of the S3 get object operation.
   */
  async getObject({ bucket, key }: IGetObjectFromS3Input): Promise<GetObjectCommandOutput> {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key })
    return this.client.send(command)
  }

  /**
   * Uploads JSON data as an object to Amazon S3.
   * @async
   * @param {IUploadJsonToS3Input} params Parameters containing the data, bucket, and key for the upload.
   * @returns {Promise<PutObjectCommandOutput>} A promise that resolves to the result of the upload operation.
   */
  uploadJSONtoS3({ data, bucket, key }: IUploadJsonToS3Input): Promise<PutObjectCommandOutput> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: data ? JSON.stringify(data) : undefined,
      ContentType: 'application/json'
    })
    return this.client.send(command)
  }

  /**
   * Downloads JSON data from an S3 object and parses it into a JavaScript object.
   * Throws an error if the downloaded string is not valid JSON.
   * @async
   * @param {IDownloadJsonFromS3Input} params Parameters including the bucket and key of the JSON object.
   * @returns {Promise<IDownloadJsonFromS3Output>} A promise resolving to the parsed JSON object.
   */
  async downloadJSONfromS3({ bucket, key }: IDownloadJsonFromS3Input): Promise<IDownloadJsonFromS3Output> {
    const fileObj = await this.getObject({ bucket, key })
    const fileString = (await fileObj.Body?.transformToString()) ?? ''

    if (!isJSONString(fileString)) {
      throw new Error(`Invalid json string, please check file`)
    }
    return JSON.parse(fileString)
  }

  /**
   * Lists all objects in a specified S3 bucket that match a given prefix.
   * @async
   * @param {IGetObjectsListInput} params Parameters including the bucket and the prefix to filter by.
   * @returns {Promise<ListObjectsCommandOutput>} A promise resolving to the list of objects.
   */
  async getObjectsList({ bucket, prefix }: IGetObjectsListInput): Promise<ListObjectsCommandOutput> {
    const command = new ListObjectsCommand({ Bucket: bucket, Prefix: prefix })
    return this.client.send(command)
  }

  /**
   * Initiates an upload of a file stream to S3, returning a PassThrough stream to which data can be written.
   * The method returns a promise that resolves upon completion of the upload.
   * @async
   * @param {IUploadFileStreamInput} params Parameters for the file stream upload including bucket, key, and optional settings.
   * @returns {Promise<{ writeStream: PassThrough; promise: Promise<PutObjectCommandOutput> }>} An object containing the writable stream and a promise that resolves upon upload completion.
   */
  async uploadFileStream({
    bucket,
    key,
    contentType,
    acl,
    cacheControl
  }: IUploadFileStreamInput): Promise<{ writeStream: PassThrough; promise: Promise<PutObjectCommandOutput> }> {
    const pass = new PassThrough()

    const commandInput: PutObjectCommandInput = {
      Bucket: bucket,
      Key: key,
      Body: pass,
      ContentType: contentType ?? 'application/json',
      ACL: acl,
      CacheControl: cacheControl
    }

    const command = new PutObjectCommand(commandInput)

    return {
      writeStream: pass,
      promise: this.client.send(command)
    }
  }
}
