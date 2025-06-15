import { Controller, Delete, Post, Body, Param, Get } from "@nestjs/common";
import { PaymentProviderService } from "../application/payment-provider.service";
import { CreatePaymentProviderDTO } from "../application/create-payment-provider.dto";

@Controller('api/v1/payment-provider')
export class PaymentProviderController {
    constructor (private readonly service: PaymentProviderService) {}

    @Post()
    async create(@Body() dto: CreatePaymentProviderDTO){
        return await this.service.create(dto)
    }

    @Get(':name')
    async get(@Param('name') name: string) {
      return await this.service.findByName(name);
    }

    @Delete(':name')
    async delete(@Param() name: string){
        return await this.service.deleteByName(name)
    }
}