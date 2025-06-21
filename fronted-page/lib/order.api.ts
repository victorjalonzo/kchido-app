import { fetchAPI } from "./api"
import { Order } from "./order.type"

const endpoint = '/orders'

export class OrderAPI {
    static getById = async (id: string, query?: Record<string, string> | Record<string, boolean>): Promise<Order> => {
        return await fetchAPI(`${endpoint}/${id}`, {}, query)
    }

    static getAll = async (query?: Record<string, string> | Record<string, boolean>): Promise<Order[]> => {
        return await fetchAPI(endpoint, {}, query)
    }
}