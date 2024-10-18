/**
 * Represents the Access Control List (ACL) settings for an S3 object, determining who can access the object.
 */
export type ObjectCannedACL =
  | 'private'
  | 'public-read'
  | 'public-read-write'
  | 'authenticated-read'
  | 'bucket-owner-read'
  | 'bucket-owner-full-control'
  | 'aws-exec-read'

/**
 * Contains parameters required for downloading JSON content from S3, specifying the bucket and object key.
 */
export interface IDownloadJsonFromS3Input {
  bucket: string

  key: string
}

/**
 * Describes the structure of JSON data returned from an S3 download, assuming a structure containing tenant information.
 */
export interface IDownloadJsonFromS3Output {
  TENANTS: { [key: string]: object }
}

/**
 * Parameters required to retrieve an object from S3, including the bucket name and object key.
 */
export interface IGetObjectFromS3Input {
  bucket: string

  key: string
}

/**
 * Parameters for retrieving a list of objects from an S3 bucket based on a specified prefix.
 */
export interface IGetObjectsListInput {
  bucket: string

  prefix: string
}

/**
 * Parameters for uploading a file stream to S3, including optional settings for content type, ACL, and cache control.
 */
export interface IUploadFileStreamInput {
  bucket: string

  key: string

  contentType?: string

  acl?: ObjectCannedACL

  cacheControl?: string
}

/**
 * Parameters for uploading JSON data to S3, detailing the object's data, bucket, and key.
 */
export interface IUploadJsonToS3Input {
  data: object

  bucket: string

  key: string
}
