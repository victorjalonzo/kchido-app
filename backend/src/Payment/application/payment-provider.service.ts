import { PaymentProviders as PrismaPaymentProvider} from "@prisma/client";
import { SharedRepository } from "src/Shared/shared.repository";
import { Model } from "src/Shared/shared.types";
import { CreatePaymentProviderDTO } from "./create-payment-provider.dto";
import { Injectable } from "@nestjs/common";
import { PaymentProviderMapper } from "../infrastructure/payment-provider.mapper";
import { PaymentProviderNotFound } from "../domain/payment-provider.exceptions";
import { PaypalService } from "./paypal.service";

@Injectable()
export class PaymentProviderService {
    model: Model = Model.PAYMENT_PROVIDERS

    constructor (
        private readonly repository: SharedRepository<PrismaPaymentProvider>,
        private readonly paypalService: PaypalService
    ) {}

    getClientId = async (name: string) => {
        return await this._findOne({ name })
        .then(paymentProvider => ({clientId: paymentProvider.clientId}))
    }

    upsert = async (dto: CreatePaymentProviderDTO) => {
        const clientId = dto.clientId
        const clientSecret = dto.clientSecret
        const paymentProviderName = dto.name

        const record = await this.repository.findOne(this.model, { name: paymentProviderName })
        if (record) await this.repository.delete(this.model, { name: record.name })
      
        const accessToken = await this.paypalService.getAccessToken(clientId, clientSecret)

        await this.paypalService.getWebhooks(accessToken)
        .then(async webhooks => {
            for (const webhook of webhooks) {
                await this.paypalService.deleteWebhook(accessToken, webhook.id)
            }
        })

        await this.paypalService.createWebhook(accessToken)

        return await this.repository.create(this.model, dto)
        .then(record => PaymentProviderMapper.toDomain(record))
    }
    
    _create = async (dto: CreatePaymentProviderDTO) => {
        return await this.repository.create(this.model, dto)
        .then((record: PrismaPaymentProvider) => PaymentProviderMapper.toDomain(record))
    }

    findByName = async (name: string) => {
        return await this._findOne({ name })
    }

    deleteByName = async (name: string) => {
        return await this._delete( { name })
    }

    _findOne = async (filter?: Record<string, any>, include?: Record<string, any>) => {
        return await this.repository.findOne(this.model, filter, include)
        .then((record: PrismaPaymentProvider) => {
            if (!record) throw new PaymentProviderNotFound()
            return PaymentProviderMapper.toDomain(record)
        })
    }

    _delete = async (filter: Record<string, any>) => {
        return await this.repository.delete(this.model, filter)
        .then((record: PrismaPaymentProvider) => {
            if (!record) throw new PaymentProviderNotFound()
            return PaymentProviderMapper.toDomain(record)
        })
    }
}