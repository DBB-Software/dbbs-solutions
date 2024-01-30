import {
  GetObjectCommand,
  GetObjectCommandOutput,
  ListObjectsCommand,
  ListObjectsCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client
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

export class CustomS3Handler {
  client: S3Client

  constructor(region: string, enableXRay: boolean = false) {
    const client = new S3Client({
      region,
      apiVersion: 'latest'
    })
    this.client = enableXRay ? AWSXRayCore.captureAWSv3Client(client) : client
  }

  async getObject({ bucket, key }: IGetObjectFromS3Input): Promise<GetObjectCommandOutput> {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key })
    return this.client.send(command)
  }

  uploadJSONtoS3({ data, bucket, key }: IUploadJsonToS3Input): Promise<PutObjectCommandOutput> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: data ? JSON.stringify(data) : undefined,
      ContentType: 'application/json'
    })
    return this.client.send(command)
  }

  async downloadJSONfromS3({ bucket, key }: IDownloadJsonFromS3Input): Promise<IDownloadJsonFromS3Output> {
    const fileObj = await this.getObject({ bucket, key })
    const fileString = (await fileObj.Body?.transformToString()) ?? ''

    if (!isJSONString(fileString)) {
      console.log(`Invalid json string: ${fileString}`) // to replace with our own logger later
      return { TENANTS: {} }
    }
    return JSON.parse(fileString)
  }

  async getObjectsList({ bucket, prefix }: IGetObjectsListInput): Promise<ListObjectsCommandOutput> {
    const command = new ListObjectsCommand({ Bucket: bucket, Prefix: prefix })
    return this.client.send(command)
  }

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
