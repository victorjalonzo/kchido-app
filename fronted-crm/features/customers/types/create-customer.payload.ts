interface CreateCustomerPayload {
    name: string
    role: 'customer'
    number: string
    email?: string
    image?: string
    creatorId: string
}