import { Customer } from "@/features/customers/types/customer.type"
import { Raffle } from "@/features/raffles/types/raffle.type"
import { Ticket } from "@/features/tickets/types/ticket.type"

export enum OrderStatus {
    PENDING = 'pending',
    COMPLETED = 'completed'
}

export interface Order {
    id: string
    shortId: string
    userId: string
    total: number
    status: OrderStatus
    paymentMethod: string
    transactionId: string 
    quantity: number
    createdAt: string
    paidAt: string

    user: Customer
    raffle: Raffle
    tickets: Ticket[]
}