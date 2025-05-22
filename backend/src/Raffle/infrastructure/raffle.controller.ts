import { Controller, Post, Get, Put, Delete, UsePipes, ValidationPipe, Body, Res, HttpStatus, Param, UseFilters, UseGuards, Req } from "@nestjs/common";
import { CreateRaffleDTO } from "../application/create-raffle.dto";
import { RaffleService } from "../application/raffle.service";
import { Request, Response } from "express";
import { RaffleExceptionFilter } from "./raffle-exception.filter";
import { JwtAuthGuard } from "src/Auth/infrastructure/jwt-auth.guard";
import { Raffle } from "../domain/raffle.entity";
import { UpdateRaffleDTO } from "../application/update-raffle.dto";

@UseFilters(RaffleExceptionFilter)
@Controller('api/v1/raffles')
export class RaffleController {
    constructor(private readonly service: RaffleService){}

    @Get('/public')
    async findPublicMany(){
        return await this.service.findPublicMany()
    }

    @Get('/public/:id')
    async findPublicOne(@Param('id') id: string){
        return await this.service.findPublicOne(id)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createRaffleDto: CreateRaffleDTO, @Req() req: Request){
        createRaffleDto.createdBy = req.user.userId
        return await this.service.create(createRaffleDto)
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    async update(@Body() updateRaffleDto: UpdateRaffleDTO, @Req() req: Request){
        console.log(updateRaffleDto)
        return await this.service.update(updateRaffleDto)
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findMany(@Res() res: Response){
        const data = await this.service.findMany()
        return res.status(HttpStatus.OK).json(data)
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response){
        const data = await this.service.findOne(id)
        return res.status(HttpStatus.OK).json(data)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteOne(@Param('id') id: string){
        return await this.service.deleteById(id)
    }
}
