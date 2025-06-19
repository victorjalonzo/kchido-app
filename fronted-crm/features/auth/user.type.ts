export interface User {
    id: string
    name: string
    email?: string
    number?: string
    image?: string
    createdAt: string
    role: "seller" | "admin"
    permissions: Permissions
}

export interface Permissions {
    id: string
    manageRaffles?: boolean
    manageSellers?: boolean
    manageTickets?: boolean
    manageChatbot?: boolean
    managePaymentMethods?: boolean
    manageCustomers?: boolean
    manageOrders?: boolean
}
  