import { fetchAPI } from "@/shared/lib/api"
import { Customer } from "../types/customer.type"
import { ImageFormat } from "@/shared/lib/formatImage"
import { Config } from "@/shared/config"

const endpoint = '/users'
const fullEndpoint = `${Config.apiURL}${endpoint}`

const formatCustomer = (customer:Customer) => {
    //if (customer.image) customer.image = `${fullEndpoint}/${customer.id}/profile`
    return customer
}

export class CustomerAPI {
    static create = async (payload: CreateCustomerPayload): Promise<Customer> => {
        const customer = <Customer>await fetchAPI(endpoint, {method: 'POST', body: JSON.stringify(payload)})
        return formatCustomer(customer)
    }

    static update = async (payload: UpdateCustomerPayload): Promise<Customer> => {
        const customer = <Customer>await fetchAPI(endpoint, {method: 'PUT', body: JSON.stringify(payload)})
        return formatCustomer(customer)
    }

    static getAll = async (query?: Record<string, any>): Promise<Customer[]> => {
        const customers = <Customer[]>await fetchAPI(`${endpoint}`, {}, {role: 'customer', ...query})
        return customers.map(customer => formatCustomer(customer));
    }

    static delete = async (id: string) => {
        const customer = <Customer>await fetchAPI(`${endpoint}/${id}`, {method: 'DELETE'})
        return formatCustomer(customer)
    }
}