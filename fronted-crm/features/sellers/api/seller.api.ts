import { fetchAPI } from "@/shared/lib/api"
import { User } from "@/shared/lib/types"
import { CreateSellerPayload } from "../types/create-seller.payload"
import { ImageFormat } from "@/shared/lib/formatImage"

const endpoint = '/users'

const formattedSeller = (seller: User) => {
    if (seller.image) seller.image = ImageFormat(seller.image)
    return seller;
}

export class SellerAPI {
    static create = async (payload: CreateSellerPayload): Promise<User> => {
        const seller = <User>await fetchAPI(`${endpoint}`, {method: 'POST', body: JSON.stringify(payload)})
        return formattedSeller(seller)
    }

    static update = async (payload: UpdateCustomerPayload): Promise<User> => {
        const seller = <User>await fetchAPI(endpoint, {method: 'PUT', body: JSON.stringify(payload)})
        return formattedSeller(seller)
    }

    static getAll = async (): Promise<User[]> => {
        const sellers = <User[]>await fetchAPI(`${endpoint}?role=seller&include=permissions`)
        return sellers.map(seller => formattedSeller(seller));
    }

    static get = async (id: string):Promise<User> => {
        const seller = <User>await fetchAPI(`${endpoint}/${id}`)
        return formattedSeller(seller)
    }

    static delete = async (id: string) => {
        const seller = <User>await fetchAPI(`${endpoint}/${id}`, {method: 'DELETE'})
        return formattedSeller(seller)
    }
}