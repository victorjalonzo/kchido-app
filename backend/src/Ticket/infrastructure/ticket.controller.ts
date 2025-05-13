import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateTicketDTO } from "../application/create-ticket.dto";
import { TicketService } from "../application/ticket.service";
import { Response } from "express";

@Controller('api/v1/tickets')
export class TicketController {
    constructor (private readonly service: TicketService){}

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createTicketDTO: CreateTicketDTO, @Res() res: Response){
        const data = await this.service.create(createTicketDTO)
        return res.status(HttpStatus.OK).json(data)
    }

    @Get()
    async find(@Param() id: string, @Res() res: Response){
        const data = await this.service.findOne(id)
        return res.status(HttpStatus.OK).json(data)
    }

    @Get()
    async findMany(@Res() res: Response){
        const data = await this.service.findMany()
        return res.status(HttpStatus.OK).json(data)
    }

    @Delete()
    async delete(@Param() id: string, @Res() res: Response){
        const data = await this.service.delete(id)
        return res.status(HttpStatus.OK).json(data)
    }
}