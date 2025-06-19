import { CreateSellerPermissionPayload } from "./create-seller.payload"

export interface UpdateSellerPayload{
    id: string
    name?: string
    number?: string 
    email: string
    avatar?: string
    permissions?: CreateSellerPermissionPayload
}