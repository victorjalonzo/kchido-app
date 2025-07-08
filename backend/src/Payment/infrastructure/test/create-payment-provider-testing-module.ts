import { Test } from "@nestjs/testing"
import { OrderModule } from "src/Order/infrastructure/order.module"
import { PaymentProviderService } from "src/Payment/application/payment-provider.service"
import { SharedModule } from "src/Shared/shared.module"
import { TaskModule } from "src/Task/infrastructure/task.module"
import { PaymentProviderController } from "../payment-provider.controller"
import { PaymentWebhookController } from "../payment-webhook.controller"
import { PaypalService } from "src/Payment/application/paypal.service"

export const createPaymentProviderTestingModule = async () => {
    return await Test.createTestingModule({
        imports: [
            SharedModule, 
            OrderModule, 
            TaskModule
        ],
        providers: [
            PaymentProviderService,
            PaypalService
        ],
        controllers: [
            PaymentProviderController,
            PaymentWebhookController
        ]
    })
    .compile()
}