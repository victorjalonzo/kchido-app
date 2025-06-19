export interface CreateOrderPayload {
    raffleId: string
    tickets: string[]
    userId: string
    total: number
    status: string 
    paymentMethod: string
    assistedBy: string
} 