interface Props {
    id: string
    serial: string
    price: number
    raffleId: string
    orderId: string
    creation: Date
}

export class Ticket implements Props {
    id: string
    serial: string
    price: number
    raffleId: string
    orderId: string
    creation: Date

    constructor (props: Props) {
        this.id = props.id
        this.serial = props.serial
        this.price = props.price
        this.raffleId = props.raffleId
        this.orderId = props.orderId
        this.creation = props.creation
    }
}