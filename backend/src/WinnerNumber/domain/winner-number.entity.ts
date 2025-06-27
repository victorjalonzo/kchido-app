interface Props {
    id: string
    serial: string
    raffleId: string
    createdAt: Date
}

export class WinnerNumber {
    id: string
    serial: string
    raffleId: string
    createdAt: Date

    constructor (props: Props) {
        this.id = props.id
        this.serial = props.serial
        this.raffleId = props.raffleId
        this.createdAt = props.createdAt
    }
}