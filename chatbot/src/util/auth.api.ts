import { fetchAPI } from "./api.js"
import { User } from "./user.types.js"

const endpoint = '/auth'

export class AuthAPI {
    static getMe = async (): Promise<User> => {
      const user = <User>await fetchAPI(`${endpoint}/me`)
      return user
    }
}