import { Config } from "../shared/config.js"
import { fetchAPI } from "./api.js"
import { Ticket } from "./ticket.type.js"

const endpoint = '/tickets'

export class TicketAPI {
    static getAll = async (query?: string): Promise<Ticket[]> => {
        return await fetchAPI(`${endpoint}?${query}`)
    }

    static get = async (id: string): Promise<Ticket> => {
        return await fetchAPI(`${endpoint}/${id}`)
    }

    static getReceipt = async (id: string) => {
        const blob = await fetchAPI(`${endpoint}/${id}/receipt`, {}, {}, 'blob')
        return blob;
    }

    static getReceiptBuffer = async (id: string) => {
        const buffer = await fetchAPI(`${endpoint}/${id}/receipt`, {}, {}, 'buffer')
        return buffer;
      }

    static delete = async (id: string) => {
        return await fetchAPI(`${endpoint}/${id}`, {method: 'DELETE'})
    }
}