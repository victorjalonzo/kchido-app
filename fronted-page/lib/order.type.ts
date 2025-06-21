import { Raffle } from "./raffle.type"
import { TicketReservation } from "./ticket-reservation.type"
import { Ticket } from "./ticket.type"

export enum OrderStatus {
    PENDING = 'pending',
    COMPLETED = 'completed'
}

export interface Order {
    id: string
    userId: string
    total: number
    status: OrderStatus
    paymentMethod: string | null
    transactionId:  string | null
    quantity: number
    createdAt: Date
    
    raffle?: Raffle
    tickets?: Ticket[]
    ticketReservations: TicketReservation[]

}