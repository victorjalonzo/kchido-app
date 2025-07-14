import { fetchAPI } from "./api"

const endpoint = "/payment-provider/public/paypal"

export class PaymentProviderAPI {
    static getClientId = async () => {
        const { clientId } = <{clientId: string}> await fetchAPI(endpoint)
        return clientId;
    }
}