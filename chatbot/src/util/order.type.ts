import { Raffle } from "./raffle.type.js"
import { TicketReservation } from "./ticket-reservation.type.js"
import { Ticket } from "./ticket.type.js"
import { User } from "./user.types.js"

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
    
    user?: User
    raffle?: Raffle
    tickets?: Ticket[]
    ticketReservations: TicketReservation[]

}

export interface CreateOrderPayload {
    raffleId: string
    tickets: number[]
    userId: string
    total: number
    paymentMethod: string
    assistedBy: string
} 