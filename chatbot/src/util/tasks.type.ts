export enum TaskStatus {
    DELIVERED = 'delivered',
    PENDING = 'pending',
    COMPLETED = 'completed',
}

export enum TaskType {
    PAYMENT = 'payment',          
    REMINDER = 'reminder',        
    ANNOUNCEMENT = 'announcement',
    FOLLOW_UP = 'follow_up',
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
}