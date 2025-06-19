import { fetchAPI } from "@/shared/lib/api"
import { Ticket } from "../types/ticket.type"

const endpoint = '/tickets'

export class TicketAPI {
    static getAll = async (query?: string): Promise<Ticket[]> => {
        return await fetchAPI(`${endpoint}?${query}`)
    }

    static getReceipt = async (id: string) => {
        const blob = await fetchAPI(`${endpoint}/${id}/receipt`, {}, {}, 'blob')
        const url = URL.createObjectURL(blob)
        return url;
    }

    static delete = async (id: string) => {
        return await fetchAPI(`${endpoint}/${id}`, {method: 'DELETE'})
    }
}