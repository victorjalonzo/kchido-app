import { OrderStatus } from "../domain/order.entity"

export interface FindOrderQuery {
    userId?: string
    raffleId?: string
    status?: OrderStatus
}
