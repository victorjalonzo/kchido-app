import { Customer } from "@/features/customers/types/customer.type"
import { Order } from "@/features/orders/types/order.type"
import { Raffle } from "@/shared/lib/types"

export interface Ticket {
    id: string
    serial: string
    price: number
    raffleId: string
    orderId: string
    creation: Date

    user: Customer
    raffle: Raffle
    order: Order
}