import { Raffle } from "src/Raffle/domain/raffle.entity"
import { Ticket } from "src/Ticket/domain/ticket.entity"
import { TicketReservation } from "src/TicketReservation/domain/ticket-reservation.entity"
import { OrderStatus } from "./order.entity"
import { PublicRaffle } from "src/Raffle/domain/public-raffle.entity"

interface PublicOrderProps {
    id: string
    shortId: string
    raffleId: string 
    total: number
    status: OrderStatus
    transactionId:  string | null
    quantity: number
    createdAt: Date
    
    raffle?: PublicRaffle
    tickets?: Ticket[]
    ticketReservations?: TicketReservation[]

}

export class PublicOrder implements PublicOrderProps {
    id: string
    shortId: string
    raffleId: string 
    total: number
    status: OrderStatus
    transactionId:  string | null 
    quantity: number
    createdAt: Date

    tickets?: Ticket[]
    raffle?: PublicRaffle
    ticketReservations?: TicketReservation[]

    constructor (props: PublicOrderProps) {
        this.id = props.id
        this.shortId = props.shortId

        this.raffleId = props.raffleId
        this.total = props.total
        this.status = props.status
        this.quantity = props.quantity
        this.createdAt = props.createdAt

        if (props.tickets) this.tickets = props.tickets
        if (props.raffle) this.raffle = props.raffle
        if (props.ticketReservations) this.ticketReservations = props.ticketReservations
    }

    isPending() {
        return this.status == OrderStatus.PENDING ? true : false
    }
}