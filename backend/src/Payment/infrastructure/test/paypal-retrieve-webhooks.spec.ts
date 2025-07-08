import { createPaymentProviderTestingModule } from "./create-payment-provider-testing-module"
import { CreatePaymentProviderDTO, PaymentProviderName } from "src/Payment/application/create-payment-provider.dto"
import { PaypalService } from "src/Payment/application/paypal.service"

describe('Paypal service: webhook creation', () => {
    let paypalService: PaypalService

    beforeAll(async () => {
        const module = await createPaymentProviderTestingModule()
        paypalService = module.get(PaypalService)
    })

    it('should retrieve Paypal webhooks', async () => {
        const payload: CreatePaymentProviderDTO = {
            clientId: "ARsehQ41wz2flCNJN5dVdTyG27NYYK8lZcWjo-tQ6oK-TSyvY3j7rCCxkN9EVt3SqDdamaMohG3VeeGS",
            clientSecret: "EKVXR3nGpN4Ve2eL4F--E1C0frR1xtUaQxv7aILWaYvdmwzBd2pN8-1V2BvRRhMQTs0kkZK7kRmtYJd5",
            name: PaymentProviderName.PAYPAL
        }
        
        const accessToken = await paypalService.getAccessToken(payload.clientId, payload.clientSecret)
        const webhooks = await paypalService.getWebhooks(accessToken)

        console.log(webhooks)

        expect(webhooks).toBeDefined()
    })
})