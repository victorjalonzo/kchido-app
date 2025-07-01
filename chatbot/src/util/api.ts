import { Config } from "../shared/config.js"
import { BotTokenStore } from "./bot-token.js"

export interface LoginCredentials {
  email: string
  password: string 
}

const API_BASE_URL = Config.apiURL

const getQueryString = (query: Record<string, string> | Record<string, boolean>): string => {
  let queryString = ""  
  if (query) {
      queryString = Object.keys(query).reduce((acc, key) => {
        const queryString = typeof query[key] == 'boolean'
        ? `include=${key}`
        : `${key}=${query[key]}`
    
        return acc == "" ? `${acc}?${queryString}` : `${acc}&${queryString}`
      }, "")
  }

  return queryString
}

const refreshToken = async () => {
  const botToken = BotTokenStore.getInstance()
  
  const payload: LoginCredentials = {
    email: Config.email,
    password: Config.password
  }

  return await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(async response => {
    const data = await response.json()

    if (!response.ok) {
      throw Error(`Cannot login ${data}`)
    }
    
    botToken.setToken(data.accessToken)
  })
}

type ReturnTypeFromResponse<T, R> =
  R extends 'blob' ? Blob :
  R extends 'buffer' ? ArrayBuffer :
  T;

export async function fetchAPI<T = any>(
  endpoint: string,
  options?: RequestInit,
  query?: Record<string, string> | Record<string, boolean>,
): Promise<T>;

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit,
  query: Record<string, string> | Record<string, boolean> | undefined,
  responseType: 'blob'
): Promise<Blob>;

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit,
  query: Record<string, string> | Record<string, boolean> | undefined,
  responseType: 'buffer'
): Promise<ArrayBuffer>;

export async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}, 
  query?: Record<string, string> | Record<string, boolean>,
  responseType: 'json' | 'blob' | 'buffer' = 'json'
): Promise<ReturnTypeFromResponse<T, typeof responseType>> {
  let triesCount = 1

  const botToken = BotTokenStore.getInstance()
  if (!botToken.getToken()) await refreshToken()

  let url = `${API_BASE_URL}${endpoint}`
  url += getQueryString(query)
  
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${botToken.getToken()}`,
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    if (response.status == 401 && triesCount < 3) {
      triesCount += 1
      await refreshToken()
      return await fetchAPI(endpoint, options, query)
    }

    const error = await response.json()
    throw new Error(error.message || "An error occurred")
  }

  switch(responseType) {
    case 'json': return await response.json()
    case 'blob': return await response.blob()

    case 'buffer': 
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(new Uint8Array(arrayBuffer));
      return buffer;
  }
}

