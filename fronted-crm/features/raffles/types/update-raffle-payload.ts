export interface UpdateRafflePayload {
    id: string
    name?: string
    image?: string
    description?: string
    pricePeerTicket?: number
    initialAmount?: number
    winnerNumbers?: string[]
    status?: string
    visibility?: string
    endsAt?: string
}