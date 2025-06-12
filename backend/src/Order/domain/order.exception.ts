import { Order } from "./order.entity"

export class OrderNotFound extends Error {
    constructor (){
        super('Order not found')
    }
}

export class OrderStatusAlreadySet extends Error {
    constructor(order: Order) {
        super(`Order ${order.id} already has a status set: ${order.status}`)
    }
}
