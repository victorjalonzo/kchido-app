import { Controller, Delete, Post, Body, Param, Get, UseFilters } from "@nestjs/common";
import { PaymentProviderService } from "../application/payment-provider.service";
import { CreatePaymentProviderDTO } from "../application/create-payment-provider.dto";
import { PaymentProviderExceptionFilter } from "./payment-provider-exception.filter";

@UseFilters(PaymentProviderExceptionFilter)
@Controller('api/v1/payment-provider')
export class PaymentProviderController {
    constructor (private readonly service: PaymentProviderService) {}

    @Get('public/:name')
    async getClientId(@Param('name') name: string) {
        return await this.service.getClientId(name)
    }

    @Post()
    async create(@Body() dto: CreatePaymentProviderDTO){
        return await this.service.upsert(dto)
    }

    @Get(':name')
    async get(@Param('name') name: string) {
      return await this.service.findByName(name);
    }

    @Delete(':name')
    async delete(@Param('name') name: string){
        return await this.service.deleteByName(name)
    }
}