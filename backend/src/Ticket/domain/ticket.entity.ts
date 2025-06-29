import { Order } from "src/Order/domain/order.entity"
import { Raffle } from "src/Raffle/domain/raffle.entity"
import { User } from "src/User/domain/user.entity"

interface Props {
    id: string
    shortId: string
    serial: string
    price: number
    receiptPath: string 
    userId: string 
    raffleId: string
    orderId: string
    createdAt: Date

    user?: User
    order?: Order
    raffle?: Raffle

}

export class Ticket implements Props {
    id: string
    shortId: string
    serial: string
    price: number
    receiptPath: string 
    userId: string 
    raffleId: string
    orderId: string
    createdAt: Date

    user: User
    raffle: Raffle
    order: Order

    constructor (props: Props) {
        this.id = props.id
        this.shortId = props.shortId
        this.serial = props.serial
        this.price = props.price
        //this.receiptPath = props.receiptPath
        this.userId = props.userId
        this.raffleId = props.raffleId
        this.orderId = props.orderId
        this.createdAt = props.createdAt

        if (props.user) this.user = props.user
        if (props.raffle) this.raffle = props.raffle
        if (props.order) this.order = props.order
    }
}