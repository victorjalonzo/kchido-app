export interface CreateSellerPermissionPayload {
    manageRaffles?: boolean
    manageTickets?: boolean
    manageChatbot?: boolean
}

export interface CreateSellerPayload{
    name: string
    role: 'seller'
    number?: string 
    email: string
    image?: string
    permissions?: CreateSellerPermissionPayload
}