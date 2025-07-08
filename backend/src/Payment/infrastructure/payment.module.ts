import { Module } from "@nestjs/common";
import { SharedModule } from "src/Shared/shared.module";
import { PaymentProviderController } from "./payment-provider.controller";
import { PaymentWebhookController } from "./payment-webhook.controller";
import { PaymentProviderService } from "../application/payment-provider.service";
import { OrderModule } from "src/Order/infrastructure/order.module";
import { TaskModule } from "src/Task/infrastructure/task.module";
import { PaypalService } from "../application/paypal.service";

@Module({
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
export class PaymentModule {}