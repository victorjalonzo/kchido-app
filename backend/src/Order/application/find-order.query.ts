import { OrderStatus } from "../domain/order.entity"

export interface FindOrderQuery {
    id?: string
    userId?: string
    raffleId?: string
    status?: OrderStatus
    assistedBy?: string
}
