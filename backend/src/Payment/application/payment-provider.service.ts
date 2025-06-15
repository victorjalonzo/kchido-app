import { PaymentProviders as PrismaPaymentProvider} from "@prisma/client";
import { SharedRepository } from "src/Shared/shared.repository";
import { Model } from "src/Shared/shared.types";
import { CreatePaymentProviderDTO } from "./create-payment-provider.dto";
import { Injectable } from "@nestjs/common";
import { PaymentProviderMapper } from "../infrastructure/payment-provider.mapper";
import { PaymentProviderNotFound } from "../domain/payment-provider.exceptions";

@Injectable()
export class PaymentProviderService {
    model: Model = Model.PAYMENT_PROVIDERS

    constructor (private readonly repository: SharedRepository<PrismaPaymentProvider>) {}
    
    create = async (dto: CreatePaymentProviderDTO) => {
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