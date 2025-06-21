import { Config } from "@/shared/config"

const API_BASE_URL = Config.apiURL

export async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}, 
  query?: Record<string, string> | Record<string, boolean>
): Promise<T> {
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
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "An error occurred")
  }

  return await response.json()
}

