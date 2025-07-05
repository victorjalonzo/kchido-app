export interface Permissions {
    id: string 
    manageRaffles?: boolean
    manageTickets?: boolean
    manageChatbot?: boolean
    manageCustomers?: boolean
    manageSellers?: boolean
}

export interface Seller {
    id: string
    shortId: string
    name: string
    role: 'seller'
    number: string
    email: string
    permissions: Permissions
    avatar: string 
}