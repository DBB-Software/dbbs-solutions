export type ObjectCannedACL =
  | 'private'
  | 'public-read'
  | 'public-read-write'
  | 'authenticated-read'
  | 'bucket-owner-read'
  | 'bucket-owner-full-control'
  | 'aws-exec-read'

export interface IDownloadJsonFromS3Input {
  bucket: string

  key: string
}

export interface IDownloadJsonFromS3Output {
  TENANTS: { [key: string]: object }
}

export interface IGetObjectFromS3Input {
  bucket: string

  key: string
}

export interface IGetObjectsListInput {
  bucket: string

  prefix: string
}

export interface IUploadFileStreamInput {
  bucket: string

  key: string

  contentType?: string

  acl?: ObjectCannedACL

  cacheControl?: string
}

export interface IUploadJsonToS3Input {
  data: object

  bucket: string

  key: string
}
