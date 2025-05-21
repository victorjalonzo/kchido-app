import { Ticket } from "src/Ticket/domain/ticket.entity"

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
    tickets: Ticket[]
    createdAt: Date
}

export class Order implements Props {
    id: string
    userId: string
    total: number
    status: OrderStatus
    paymentMethod: string
    transactionId: string 
    tickets: Ticket[]
    createdAt: Date

    constructor (props: Props) {
        this.id = props.id
        this.userId = props.userId
        this.total = props.total
        this.status = props.status
        this.paymentMethod = props.paymentMethod
        this.tickets = props.tickets
        this.createdAt = props.createdAt
    }
}