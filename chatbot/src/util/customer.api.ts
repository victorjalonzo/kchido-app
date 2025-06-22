
import { fetchAPI } from "./api.js"
import { CreateCustomerPayload, Customer, UpdateCustomerPayload } from "./customer.type.js"

const endpoint = '/users'

export class CustomerAPI {
    static create = async (payload: CreateCustomerPayload): Promise<Customer> => {
        const customer = <Customer>await fetchAPI(endpoint, {method: 'POST', body: JSON.stringify(payload)})
        return customer
    }

    static update = async (payload: UpdateCustomerPayload): Promise<Customer> => {
        const customer = <Customer>await fetchAPI(endpoint, {method: 'PUT', body: JSON.stringify(payload)})
        return customer
    }

    static getAll = async (query?: Record<string, string> | Record<string, boolean>): Promise<Customer[]> => {
        const customers = <Customer[]>await fetchAPI(`${endpoint}`, {}, query ?? {role: 'customer'})
        return customers
    }
}