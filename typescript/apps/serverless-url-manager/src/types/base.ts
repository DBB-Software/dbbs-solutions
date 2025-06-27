export interface LambdaResponse {
  statusCode: number
  headers: { [key: string]: string }
  body: string
}
