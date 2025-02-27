/**
 * Generic API response structure for POEditor API.
 */
export interface POEditorAPIResponse<T> {
  response: {
    status: string // Status of the API response (e.g., "success")
    code: string // Response code (e.g., "200")
    message: string // Response message (e.g., "OK")
  }
  result: T // Generic placeholder for specific response data
}

/**
 * Utility type for API requests that require authentication.
 * Ensures `apiToken` is always present.
 */
export type WithAuth<T> = T & { apiToken: string }

/**
 * Utility type for API requests that require both authentication and a project ID.
 * Ensures `apiToken` and `projectId` are present.
 */
export type WithAuthAndProject<T> = T & { apiToken: string; projectId: number | string }
