import { fetchAPI } from "./api.js"
import { Raffle, UpdateRafflePayload } from "./raffle.type.js";

const endpoint = '/raffles'

export class RaffleAPI {
    static async getAll(query?: Record<string, string> | Record<string, boolean>): Promise<Raffle[]> {
      const raffles = <Raffle[]>await fetchAPI(endpoint, {}, query)
      return raffles
    }
    
    static async getById(id: string, query?: Record<string, string> | Record<string, boolean>): Promise<Raffle | undefined> {
      const raffle = <Raffle>await fetchAPI(`${endpoint}/${id}`, {}, query)
      return raffle
    }

    static async update(data: UpdateRafflePayload){
      const raffle = <Raffle>await fetchAPI(`${endpoint}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      return raffle;
    }
}