import { fetchAPI } from "@/shared/lib/api"
import { Order } from "../types/order.type"
import { CreateOrderPayload } from "../types/create-order.payload"

const endpoint = '/orders'

export class OrderAPI {
    static create = async (payload: CreateOrderPayload): Promise<Order> => {
        return await fetchAPI(endpoint, { method: 'POST', body: JSON.stringify(payload)})
    }

    static getAll = async (query?: Record<string, string> | Record<string, boolean>): Promise<Order[]> => {
        return await fetchAPI(endpoint, {}, query)
    }

    static delete = async (id: string, query?: Record<string, string> | Record<string, boolean>) => {
        return await fetchAPI(`${endpoint}/${id}`, {method: 'DELETE'}, query)
    }
}