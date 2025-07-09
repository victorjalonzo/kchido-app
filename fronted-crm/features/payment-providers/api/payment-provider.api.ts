import { fetchAPI } from "@/shared/lib/api";
import { CreatePaymentProviderPayload } from "../types/create-payment-provider.payload";
import { PaymentProvider } from "../types/payment-provider.type";

const endpoint = "/payment-provider"

export class PaymentProviderAPI {
    static create = async (payload: CreatePaymentProviderPayload) => {
        const paymentProvider = <PaymentProvider>await fetchAPI(endpoint, {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        return paymentProvider
    }

    static getPaypal = async () => {
        const paymentProvider = <PaymentProvider>await fetchAPI(`${endpoint}/paypal`)
        return paymentProvider;
    }

    static delete = async () => {
        const paymentProvider = <PaymentProvider>await fetchAPI(`${endpoint}/paypal`, {
            method: 'DELETE'
        })
        return paymentProvider;
    }
}