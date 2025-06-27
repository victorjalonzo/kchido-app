import { Order } from "src/Order/domain/order.entity"
import { Raffle } from "src/Raffle/domain/raffle.entity"
import { User } from "src/User/domain/user.entity"
import { SubTask } from "./subtask.entity"

export enum TaskStatus {
    DELIVERING = 'delivering',
    PENDING = 'pending',
    COMPLETED = 'completed',
}

export enum TaskType {
    RAFFLE_ENDED = 'raffle_ended',
    PAYMENT_COMPLETED = 'payment_completed',
}

interface TaskProps {
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

export class Task {
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

    constructor (props: TaskProps) {
        this.id = props.id
        this.type = props.type
        this.status = props.status
        this.description =  props.description
        this.createdAt = props.createdAt
        this.updatedAt = props.updatedAt
        this.retries = props.retries ?? 0
                      
        this.customerId = props.customerId
        this.orderId =  props.orderId
        this.raffleId = props.raffleId
    
        this.subTasks = props.subTasks ?? []
        this.customer = props.customer
        this.order = props.order
        this.raffle = props.raffle
    }

    get isPending(): boolean {
        return this.status == TaskStatus.PENDING ? true : false
    }

    get isCompleted(): boolean {
        return this.status == TaskStatus.COMPLETED ? true : false
    }

    get areSubTasksCompleted(): boolean {
        return this.subTasks?.every(sub => sub.status === TaskStatus.COMPLETED) ?? false
    }

}