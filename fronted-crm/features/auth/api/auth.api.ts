import { fetchAPI } from "@/shared/lib/api"
import { User } from "@/shared/lib/types"

export interface LoginCredentials {
    email: string
    password: string 
}

const endpoint = '/auth'

export class AuthAPI {
    static login = async (payload: LoginCredentials): Promise<string> => {
      const data = <{accessToken: string}>await fetchAPI(`${endpoint}/login`, {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      return data.accessToken
    }

    static get = async (): Promise<User> => {
      const user = <User>await fetchAPI(`${endpoint}/me`, {}, {permissions: true})
      
      return user
    }

    static update = async (payload: Partial<User>): Promise<User> => {
      const user = <User>await fetchAPI(`${endpoint}/me`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      })

      return user
    }
}

