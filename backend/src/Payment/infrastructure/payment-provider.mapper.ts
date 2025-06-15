import { PaymentProviders as PrismaPaymentProvider } from "@prisma/client";
import { PaymentProvider } from "../domain/payment-provider.entity";

export class PaymentProviderMapper {
    static toDomain = (raw: PrismaPaymentProvider) => {
        return new PaymentProvider(raw)
    }
}