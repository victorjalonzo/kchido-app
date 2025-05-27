import { Raffle } from "src/Raffle/domain/raffle.entity"
import { Ticket } from "src/Ticket/domain/ticket.entity"
import { User } from "src/User/domain/user.entity"

export enum OrderStatus {
    PENDING = 'pending',
    COMPLETED = 'completed'
}

interface Props {
    id: string
    userId: string
    total: number
    status: OrderStatus
    paymentMethod: string
    transactionId: string
    quantity: number
    createdAt: Date
    
    user?: User
    raffle?: Raffle
    tickets?: Ticket[]

}

export class Order implements Props {
    id: string
    userId: string
    total: number
    status: OrderStatus
    paymentMethod: string
    transactionId: string 
    quantity: number
    createdAt: Date

    user?: User
    tickets?: Ticket[]
    raffle?: Raffle

    constructor (props: Props) {
        this.id = props.id
        this.userId = props.userId
        this.total = props.total
        this.status = props.status
        this.paymentMethod = props.paymentMethod
        this.quantity = props.quantity
        this.createdAt = props.createdAt

        if (props.tickets) this.tickets = props.tickets
        if (props.user) this.user = props.user
        if (props.raffle) this.raffle = props.raffle
    }
}