import { Module } from "@nestjs/common";
import { SharedModule } from "src/Shared/shared.module";
import { PaymentProviderController } from "./payment-provider.controller";
import { PaymentWebhookController } from "./payment-webhook.controller";
import { PaymentProviderService } from "../application/payment-provider.service";
import { OrderModule } from "src/Order/infrastructure/order.module";

@Module({
    imports: [SharedModule, OrderModule],
    providers: [PaymentProviderService],
    controllers: [
        PaymentProviderController,
        PaymentWebhookController
    ]
})
export class PaymentModule {}