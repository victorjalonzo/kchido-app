import { Order } from "src/Order/domain/order.entity"
import { Raffle } from "src/Raffle/domain/raffle.entity"
import { User } from "src/User/domain/user.entity"

interface Props {
    id: string
    serial: string
    raffleId: string
    orderId: string
    expiresAt: Date
    
    user?: User
    raffle?: Raffle
    order?: Order
}

export class TicketReservation {
    id: string
    serial: string
    raffleId: string
    orderId: string
    expiresAt: Date
    
    user?: User
    raffle?: Raffle
    order?: Order

    constructor (props: Props) {
        this.id = props.id
        this.serial = props.serial
        this.orderId = props.orderId
        this.expiresAt = props.expiresAt

        this.user = props.user
        this.raffle = props.raffle
        this.order = props.order
    }
}