import {Controller, Get, Post, Param, UsePipes, ValidationPipe, Res, HttpStatus, Query, UseFilters, Body, Delete, Put, Req, UseGuards} from "@nestjs/common"
import { UserService } from "../application/user.service"
import { Request, Response } from 'express';
import { UserExceptionFilter } from "./user-exception.filter";
import { CreateUserDTO } from "../application/create-user.dto";
import { UpdateUserDTO } from "../application/update-user.dto";
import { FindUserDto } from "../application/find-user-dto";
import { QueryRequestExtractor } from "src/Shared/util/queries-extractor";
import { JwtAuthGuard } from "src/Auth/infrastructure/jwt-auth.guard";

@UseFilters(UserExceptionFilter)
@Controller("api/v1/users")
export class UserController {
    validFilters = ['role', 'number', 'creatorId']
    validIncludes = ['permissions', 'tickets']

    constructor(private readonly userService: UserService){}

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createUserDto: CreateUserDTO, @Res() res: Response) {
        const data = await this.userService.create(createUserDto)
        return res.status(HttpStatus.OK).json(data)
    }

    @Put()
    @UsePipes(new ValidationPipe())
    async update(@Body() updateUserDto: UpdateUserDTO){
        return await this.userService.update(updateUserDto)
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({transform: true}))
    async findMany(@Query() findUserDto: FindUserDto, @Req() req: Request) {
        const {filterQueries, includeQueries } = QueryRequestExtractor.extract(findUserDto, {
            validFilters: this.validFilters,
            validIncludes: this.validIncludes
        })

        return await this.userService.findManyWithScope(req.user.userId, filterQueries, includeQueries)
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string, @Query() findUserDto: FindUserDto, @Req() req: Request) {
        const {filterQueries, includeQueries } = QueryRequestExtractor.extract(findUserDto, {
            validFilters: this.validFilters,
            validIncludes: this.validIncludes
        })

        filterQueries['id'] = id

        return await this.userService.findWithScope(req.user.userId, filterQueries, includeQueries)
    }

    @Get(':id/profile')
    async getProfilePhoto(@Param('id') id: string, @Res() res: Response){
        const profilePath = await this.userService.getProfilePhoto(id)
        return res.sendFile(profilePath)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id: string, @Req() req: Request) {
        return await this.userService.deleteWithScope(req.user.userId, id)
    }
}