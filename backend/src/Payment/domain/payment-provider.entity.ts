interface Props {
    id: string
    name: string 
    clientId: string
    clientSecret: string
}

export class PaymentProvider {
    id: string 
    name: string 
    clientId: string
    clientSecret: string

    constructor(props: Props) {
        this.name = props.name 
        this.clientId = props.clientId
        this.clientSecret = props.clientSecret
    }
}