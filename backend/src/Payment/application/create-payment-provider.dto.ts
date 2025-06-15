export enum PaymentProviderName {
    PAYPAL = 'paypal'
}

export interface CreatePaymentProviderDTO {
    name: PaymentProviderName
    clientId: string
    clientSecret: string 
}