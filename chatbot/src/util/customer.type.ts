export interface Customer {
    id: string
    name: string
    image: string
    role: 'customer'
    number: string
    createdAt: Date
    status: 'active' | 'banned'
}

export interface CreateCustomerPayload {
    name: string
    role: 'customer'
    country: string
    state: string 
    number: string
    email?: string
    image?: string 
}

export interface UpdateCustomerPayload {
    id: string
    country?: string
    state?: string 
    name?: string
    number?: string
    email?: string
    image?: string 
}