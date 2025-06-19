import { Config } from "../config"

function getCookie(name: string): string | null {
  const cookies = typeof document !== "undefined" ? document.cookie.split("; ") : []
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=")
    if (key === name) return decodeURIComponent(value)
  }
  return null
}

const API_BASE_URL = Config.apiURL

type ReturnTypeFromResponse<T, R> = R extends 'blob' ? Blob : T;

export async function fetchAPI<T = any>(
  endpoint: string,
  options?: RequestInit,
  query?: Record<string, string> | Record<string, boolean>,
): Promise<T>;

export async function fetchAPI(
  endpoint: string,
  options: RequestInit,
  query: Record<string, string> | Record<string, boolean> | undefined,
  responseType: 'blob'
): Promise<Blob>;

export async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}, 
  query?: Record<string, string> | Record<string, boolean>,
  responseType: 'json' | 'blob' = 'json'
): Promise<ReturnTypeFromResponse<T, typeof responseType>> {
  let url = `${API_BASE_URL}${endpoint}`
  
  if (query) {
      const queryString = Object.keys(query).reduce((acc, key) => {
        const queryString = typeof query[key] == 'boolean'
        ? `include=${key}`
        : `${key}=${query[key]}`
    
        return acc == "" ? `${acc}?${queryString}` : `${acc}&${queryString}`
      }, "")

      url += queryString 
  }
  
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getCookie('jwt')}`,
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "An error occurred")
  }

  return responseType == 'json'
  ? await response.json()
  : await response.blob()
}
