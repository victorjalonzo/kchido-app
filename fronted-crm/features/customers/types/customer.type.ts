import { Ticket } from "@/features/tickets/types/ticket.type"

export interface Customer {
    id: string
    name: string
    image: string
    role: 'customer'
    number: string | null
    email: string | null
    status: 'active' | 'banned'
    createdAt: Date

    tickets?: Ticket[]
}