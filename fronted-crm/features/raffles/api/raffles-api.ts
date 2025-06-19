import { ImageFormat } from "@/shared/lib/formatImage"
import { CreateRafflePayload } from "../types/create-raffle-payload"
import { Raffle } from "../types/raffle.type"
import { UpdateRafflePayload } from "../types/update-raffle-payload"
import { fetchAPI } from "@/shared/lib/api"

const endpoint = '/raffles'

const formatRaffle = (raffle: Raffle) => {
  if (raffle.image) raffle.image = ImageFormat(raffle.image)
    return raffle;
}

export class RaffleAPI {
    static create = async (payload: CreateRafflePayload): Promise<Raffle> => {
      const raffle = <Raffle>await fetchAPI(endpoint, {method: 'POST', body: JSON.stringify(payload)})
      return formatRaffle(raffle);
    }

    static async update(payload: UpdateRafflePayload): Promise<Raffle> {
      const raffle = <Raffle>await fetchAPI(endpoint, {method: 'PUT', body: JSON.stringify(payload)})
      return formatRaffle(raffle);
    }

    static async getAll(query?: Record<string, string> | Record<string, boolean>): Promise<Raffle[]> {
      const raffles = <Raffle[]>await fetchAPI(endpoint, {}, query)
      return raffles.map(raffle => formatRaffle(raffle))
    }
    
    static async getById(id: string, query?: Record<string, string> | Record<string, boolean>): Promise<Raffle | undefined> {
      const raffle = <Raffle>await fetchAPI(`${endpoint}/${id}`, query)
      return formatRaffle(raffle);
    }

    static async deleteById(id: string): Promise<Raffle | undefined> {
      const raffle = <Raffle> await fetchAPI(`${endpoint}/${id}`, {method: 'DELETE'})
      return formatRaffle(raffle);
    }
}


