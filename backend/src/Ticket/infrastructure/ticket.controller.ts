import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateTicketDTO } from "../application/create-ticket.dto";
import { TicketService } from "../application/ticket.service";
import { FindTicketDTO } from "../application/find-ticket.dto";
import { TicketJoinOption } from "../application/ticket-join-option";
import { FindTicketFilter } from "../application/find-ticket-filter";
import { Response } from "express";

@Controller('api/v1/tickets')
export class TicketController {
    constructor (private readonly service: TicketService){}

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createTicketDTO: CreateTicketDTO){
        return await this.service.create(createTicketDTO)
    }

    @Get()
    @UsePipes(new ValidationPipe({transform: true}))
    async findMany(@Query() query: FindTicketDTO){
        const joins: TicketJoinOption = {}
        const filters: FindTicketFilter = {}

        if (query.include) {
            const availableJoins = ['user', 'raffle', 'order']

            query.include.forEach(key => {
                availableJoins.includes(key) ? joins[key] = true: null
            })
        }

        const availableFilters = ['userId', 'raffleId', 'orderId']
        availableFilters.forEach(filter => 
            query[filter] ? filters[filter] = query[filter] : null
        )

        return await this.service.findMany(filters, joins)
    }

    @Get(':id')
    async find(@Param('id') id: string){
        return await this.service.findOne(id)
    }

    @Delete(':id')
    async delete(@Param('id') id: string){
        return await this.service.delete(id)
    }

    @Get(':id/receipt')
    async getReceipt(@Param('id') id: string,  @Res() res: Response) {
        const filePath = await this.service.getTicketReceiptFile(id);
        res.sendFile(filePath);
    }
}