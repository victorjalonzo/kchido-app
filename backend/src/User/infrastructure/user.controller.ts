import {Controller, Get, Post, Param, UsePipes, ValidationPipe, Res, HttpStatus, Query, UseFilters, Body, Delete, Put} from "@nestjs/common"
import { UserService } from "../application/user.service"
import { Response } from 'express';
import { UserExceptionFilter } from "./user-exception.filter";
import { CreateUserDTO } from "../application/create-user.dto";
import { UpdateUserDTO } from "../application/update-user.dto";
import { FindUserDto } from "../application/find-user-dto";
import { QueryRequestExtractor } from "src/Shared/util/queries-extractor";

@UseFilters(UserExceptionFilter)
@Controller("api/v1/users")
export class UserController {
    validFilters = ['role', 'number']
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
    @UsePipes(new ValidationPipe({transform: true}))
    async findMany(@Query() findUserDto: FindUserDto) {
        const {filterQueries, includeQueries } = QueryRequestExtractor.extract(findUserDto, {
            validFilters: this.validFilters,
            validIncludes: this.validIncludes
        })

        console.log(filterQueries, includeQueries)

        return await this.userService.findMany(filterQueries, includeQueries)
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Query() findUserDto: FindUserDto) {
        const {filterQueries, includeQueries } = QueryRequestExtractor.extract(findUserDto, {
            validFilters: this.validFilters,
            validIncludes: this.validIncludes
        })

        filterQueries['id'] = id

        return await this.userService.findOne(filterQueries, includeQueries)
    }

    @Get(':id/profile')
    async getProfilePhoto(@Param('id') id: string, @Res() res: Response){
        const profilePath = await this.userService.getProfilePhoto(id)
        return res.sendFile(profilePath)
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.userService.delete(id)
    }
}