import { Ticket } from "src/Ticket/domain/ticket.entity"
import { TaskStatus } from "./task.entity"

export interface SubTaskProps {
    id: string
    taskId: string
    customerId: string
    status: TaskStatus 
    retries: number
    ticketId?: string | null
    createdAt: Date
    updatedAt: Date

    ticket?: Ticket
}

export class SubTask {
    id: string
    taskId: string
    customerId: string
    status: TaskStatus 
    retries: number
    ticketId?: string | null
    createdAt: Date
    updatedAt: Date

    ticket?: Ticket

    constructor (props: SubTaskProps) {
        this.id = props.id
        this.taskId = props.taskId
        this.customerId = props.customerId
        this.status = props.status
        this.ticketId = props.ticketId
        this.retries = props.retries
        this.createdAt = props.createdAt
        this.updatedAt = props.updatedAt

        this.ticket = props.ticket
    }
}