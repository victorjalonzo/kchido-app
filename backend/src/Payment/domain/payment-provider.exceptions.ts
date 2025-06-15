export class PaymentProviderNotFound extends Error {
    constructor (){
        super('Payment provider not found')
    }
}