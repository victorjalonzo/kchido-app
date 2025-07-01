import { Order } from "./order.type"
import { Raffle } from "./raffle.type"
import { Ticket } from "./ticket.type"
import { User } from "./user.types"

export enum TaskStatus {
    DELIVERED = 'delivered',
    PENDING = 'pending',
    COMPLETED = 'completed',
}

export enum TaskType {
    RAFFLE_ENDED = 'raffle_ended',
    PAYMENT_COMPLETED = 'payment_completed',
}

export interface SubTask {
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

export interface Task {
    id: string                
    type: TaskType
    status: TaskStatus
    description?: string | null
    createdAt: Date
    updatedAt: Date
    retries: number
                  
    customerId?: string | null
    orderId?: string | null
    raffleId?: string | null

    subTasks?: SubTask[]
    customer?: User | null
    order?: Order | null
    raffle?: Raffle | null
}

export class UpdateTaskPayload {
    id: string
    status: TaskStatus
}

export class UpdateSubTaskPayload {
    id: string
    status: TaskStatus
}