import { Order } from "@/features/orders/types/order.type"
import { Ticket } from "@/features/tickets/types/ticket.type"

export enum RaffleVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private'
}

export enum RaffleStatus {
  ONGOING = 'ongoing',
  ENDED = 'ended'
}

export interface Raffle {
    id: string
    name: string
    description: string | null
    image: string | null
    pricePeerTicket: number
    initialAmount: number
    accumulated: number
    subscribers: number
    status: RaffleStatus
    visibility: RaffleVisibility
    //winnerNumbers: WinnerNumber[]
    createdBy: string
    createdAt: string
    endsAt: string

    tickets?: Ticket[]
    orders?: Order[]
}