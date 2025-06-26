import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateOrderDTO } from "../application/create-order.dto";
import { OrderService } from "../application/order.service";
import { UpdateOrderDTO } from "../application/update-order.dto";
import { IncludeOrderQuery } from "../application/include-order.query";
import { FindOrderQuery } from "../application/find-order.query";
import { FindOrderDto } from "../application/find-order.dto";
import { OrderExceptionFilter } from "./order-exception.filter";
import { Request } from "express";
import { JwtAuthGuard } from "src/Auth/infrastructure/jwt-auth.guard";
import { QueryRequestExtractor } from "src/Shared/util/queries-extractor";

@UseFilters(OrderExceptionFilter)
@Controller('api/v1/orders')
export class OrderController {
    validFilters = ['userId', 'raffleId', 'status']
    validIncludes = ['user', 'raffle', 'tickets', 'ticketReservations']

    constructor(private readonly service: OrderService){}

    @UseGuards(JwtAuthGuard)
    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createOrderDto: CreateOrderDTO, @Req() req: Request){
        createOrderDto.assistedBy = req.user.userId
        return await this.service.create(createOrderDto)
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    @UsePipes(new ValidationPipe())
    async update(@Body() updateOrderDto: UpdateOrderDTO){
        return await this.service.update(updateOrderDto)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @UsePipes(new ValidationPipe({transform: true}))
    async findMany(@Query() query: FindOrderDto, @Req() req: Request){
        const userId = req.user.userId

        const { filterQueries, includeQueries } = QueryRequestExtractor.extract(query, {
            validFilters: this.validFilters,
            validIncludes: this.validIncludes
        })

        return await this.service.findManyWithUserScope(userId, filterQueries, includeQueries)
    }

    @Get(':id')
    @UsePipes(new ValidationPipe({transform: true}))
    async findOne(@Param('id') id: string, @Query() query: FindOrderDto){
        const { includeQueries } = QueryRequestExtractor.extract(query, {
            validFilters: this.validFilters,
            validIncludes: this.validIncludes
        })

        return await this.service.findById(id, includeQueries)
    }

    @Delete(':id')
    async delete(@Param('id') id: string){
        return await this.service.delete(id)
    }
    
}