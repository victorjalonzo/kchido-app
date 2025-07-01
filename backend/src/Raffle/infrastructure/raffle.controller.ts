import { Controller, Post, Get, Put, Delete, UsePipes, ValidationPipe, Body, Res, HttpStatus, Param, UseFilters, UseGuards, Req, Query } from "@nestjs/common";
import { CreateRaffleDTO } from "../application/create-raffle.dto";
import { RaffleService } from "../application/raffle.service";
import { Request, Response } from "express";
import { RaffleExceptionFilter } from "./raffle-exception.filter";
import { JwtAuthGuard } from "src/Auth/infrastructure/jwt-auth.guard";
import { UpdateRaffleDTO } from "../application/update-raffle.dto";
import { QueryRequestExtractor } from "src/Shared/util/queries-extractor";
import { FindRaffleDto } from "../application/find-raffle.dto";

@UseFilters(RaffleExceptionFilter)
@Controller('api/v1/raffles')
export class RaffleController {
    validFilters = ['createdBy', 'status', 'visibility']
    publicValidIncludes = ['winnerNumbers']
    privateValidIncludes = ['participants', 'orders', 'tickets']

    constructor(private readonly service: RaffleService){}

    @UsePipes(new ValidationPipe({transform: true}))
    @Get('/public')
    async findPublicMany(@Query() findRaffleDto: FindRaffleDto){

        const { includeQueries } = QueryRequestExtractor.extract(findRaffleDto, {
            validFilters: this.validFilters,
            validIncludes: this.publicValidIncludes
        })

        return await this.service.findPublicMany(includeQueries)
    }

    @UsePipes(new ValidationPipe({transform: true}))
    @Get('/public/:id')
    async findPublicOne(@Param('id') id: string, @Query() findRaffleDto: FindRaffleDto){

        const { includeQueries } = QueryRequestExtractor.extract(findRaffleDto, {
            validFilters: this.validFilters,
            validIncludes: this.publicValidIncludes
        })

        return await this.service.findPublicOne(id, includeQueries)
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({transform: true}))
    @Post()
    async create(@Body() createRaffleDto: CreateRaffleDTO, @Req() req: Request){
        createRaffleDto.creatorId = req.user.userId
        return await this.service.create(createRaffleDto)
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({transform: true}))
    @Put()
    async update(@Body() updateRaffleDto: UpdateRaffleDTO){
        return await this.service.update(updateRaffleDto)
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({transform: true}))
    @Get()
    async findMany(@Query() findRaffleDto: FindRaffleDto){
        const {filterQueries, includeQueries } = QueryRequestExtractor.extract(findRaffleDto, {
            validFilters: this.validFilters,
            validIncludes: this.privateValidIncludes.concat(this.publicValidIncludes)
        })
        
        return await this.service.findMany(filterQueries, includeQueries)
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({transform: true}))
    @Get(':id')
    async findOne(@Param('id') id: string, @Query() findRaffleDto: FindRaffleDto){
        const { includeQueries } = QueryRequestExtractor.extract(findRaffleDto, {
            validFilters: this.validFilters,
            validIncludes: this.privateValidIncludes.concat(this.publicValidIncludes)
        })

        return await this.service.findById(id, includeQueries)
    }

    @Get(':id/image')
    async getImage(@Param('id') id: string, @Res() res: Response){
        const imagePath = await this.service.getRaffleImage(id)
        return res.sendFile(imagePath)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteOne(@Param('id') id: string){
        return await this.service.deleteById(id)
    }
}
