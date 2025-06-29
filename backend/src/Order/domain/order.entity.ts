import { Raffle } from "src/Raffle/domain/raffle.entity"
import { Ticket } from "src/Ticket/domain/ticket.entity"
import { TicketReservation } from "src/TicketReservation/domain/ticket-reservation.entity"
import { User } from "src/User/domain/user.entity"

export enum OrderStatus {
    PENDING = 'pending',
    COMPLETED = 'completed'
}

interface Props {
    id: string
    shortId: string
    userId: string
    raffleId: string 
    total: number
    status: OrderStatus
    paymentMethod: string | null
    transactionId:  string | null
    quantity: number
    createdAt: Date
    
    user?: User
    raffle?: Raffle
    tickets?: Ticket[]
    ticketReservations?: TicketReservation[]

}

export class Order implements Props {
    id: string
    shortId: string
    userId: string
    raffleId: string 
    total: number
    status: OrderStatus
    paymentMethod:  string | null
    transactionId:  string | null 
    quantity: number
    createdAt: Date

    user?: User
    tickets?: Ticket[]
    raffle?: Raffle
    ticketReservations?: TicketReservation[]

    constructor (props: Props) {
        this.id = props.id
        this.shortId = props.shortId
        this.userId = props.userId
        this.raffleId = props.raffleId
        this.total = props.total
        this.status = props.status
        this.paymentMethod = props.paymentMethod
        this.quantity = props.quantity
        this.createdAt = props.createdAt

        if (props.tickets) this.tickets = props.tickets
        if (props.user) this.user = props.user
        if (props.raffle) this.raffle = props.raffle
        if (props.ticketReservations) this.ticketReservations = props.ticketReservations
    }

    isPending() {
        return this.status == OrderStatus.PENDING ? true : false
    }
}