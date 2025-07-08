import { PaymentProviderService } from "src/Payment/application/payment-provider.service"
import { createPaymentProviderTestingModule } from "./create-payment-provider-testing-module"
import { CreatePaymentProviderDTO, PaymentProviderName } from "src/Payment/application/create-payment-provider.dto"

describe('Paypal payment provider', () => {
    let service: PaymentProviderService
    
    beforeAll(async () => {
        const module = await createPaymentProviderTestingModule()
        service = module.get(PaymentProviderService)
    })

    it('Should return an access token', async () => {
        const payload: CreatePaymentProviderDTO = {
            clientId: "ARsehQ41wz2flCNJN5dVdTyG27NYYK8lZcWjo-tQ6oK-TSyvY3j7rCCxkN9EVt3SqDdamaMohG3VeeGS",
            clientSecret: "EKVXR3nGpN4Ve2eL4F--E1C0frR1xtUaQxv7aILWaYvdmwzBd2pN8-1V2BvRRhMQTs0kkZK7kRmtYJd5",
            name: PaymentProviderName.PAYPAL
        }
        
        const accessCode = await service._getPaypalAccessToken(payload.clientId, payload.clientSecret)
        console.log(accessCode)
        
        expect(accessCode).toBeDefined()
    })
})