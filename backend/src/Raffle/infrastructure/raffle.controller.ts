import { Controller, Post, Get, Put, Delete, UsePipes, ValidationPipe, Body, Res, HttpStatus, Param, UseFilters } from "@nestjs/common";
import { CreateRaffleDTO } from "../application/create-raffle.dto";
import { RaffleService } from "../application/raffle.service";
import { Response } from "express";
import { RaffleExceptionFilter } from "./raffle-exception.filter";

@UseFilters(RaffleExceptionFilter)
@Controller('api/v1/raffles')
export class RaffleController {
    constructor(private readonly service: RaffleService){}

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createRaffleDto: CreateRaffleDTO){
        return await this.service.create(createRaffleDto)
    }

    @Get()
    async findMany(@Res() res: Response){
        const data = await this.service.findMany()
        return res.status(HttpStatus.OK).json(data)
    }

    @Get(':id')
    async findOne(@Param() id: string, @Res() res: Response){
        const data = await this.service.findOne(id)
        return res.status(HttpStatus.OK).json(data)
    }
}
