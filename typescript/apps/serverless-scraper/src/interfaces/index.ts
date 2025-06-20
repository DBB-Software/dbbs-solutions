export interface IConfig {
  region: string
  stage: string
  sqsQueueUrl: string
  s3BucketName: string
  s3BucketUrl: string
}

export interface IDocumentUrl {
  url: string
  title: string
  // TODO define correct properties
}
