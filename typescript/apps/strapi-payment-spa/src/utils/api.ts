import Cookies from 'js-cookie'
import config from '../config'

export interface FetchData {
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  token?: string
  data?: object
}

export const fetchData = async ({ endpoint, method, token, data }: FetchData) => {
  const response = await fetch(`${config.apiUrl}${endpoint}`, {
    method,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const text = await response.text()
  try {
    return text ? JSON.parse(text) : {}
  } catch (error) {
    console.error('Failed to parse JSON:', error)
    return {}
  }
}

export const createSecuredApi = ({ endpoint, method, data }: FetchData) => {
  const jwt = Cookies.get('jwt')
  if (!jwt) {
    throw new Error('No JWT found')
  }

  return fetchData({
    endpoint,
    method,
    token: jwt,
    data
  })
}
