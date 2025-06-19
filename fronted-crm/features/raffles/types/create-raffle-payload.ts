export interface CreateRafflePayload {
    name: string
    image?: string
    description?: string
    pricePeerTicket: number
    initialAmount: number
    visibility: string
    status: string
    endsAt: string
}