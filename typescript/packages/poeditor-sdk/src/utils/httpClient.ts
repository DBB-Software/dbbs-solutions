import { POEDITOR_API_BASE_URL } from '../constants'

/**
 * HTTP Client for handling POEditor API requests.
 * - Supports `Record<string, string>` for `body`.
 * - Returns `T` directly on success.
 * - Throws an error on failure (HTTP or API-level errors).
 */
export const httpClient = async <T>({
  url,
  body,
  method = 'POST',
  headers,
  ...restOptions
}: Omit<RequestInit, 'body'> & { url: string; baseUrl?: string; body: Record<string, string> }): Promise<T> => {
  const response = await fetch(`${POEDITOR_API_BASE_URL}${url}`, {
    method,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', ...headers },
    body: new URLSearchParams(body),
    ...restOptions
  })

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  try {
    return await response.json()
  } catch {
    throw new Error('Invalid JSON response from server')
  }
}
