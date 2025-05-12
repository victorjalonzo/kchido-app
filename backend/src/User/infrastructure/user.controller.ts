import {Controller, Get, Post, Param, UsePipes, ValidationPipe, Res, HttpStatus, Query, UseFilters, Body, Delete} from "@nestjs/common"
import { UserService } from "../application/user.service"
import { Response } from 'express';
import { UserExceptionFilter } from "./user-exception.filter";
import { CreateUserDTO } from "../application/create-user.dto";

@UseFilters(UserExceptionFilter)
@Controller("api/v1/users")
export class UserController {
    constructor(private readonly userService: UserService){}

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createUserDto: CreateUserDTO, @Res() res: Response) {
        const data = await this.userService.create(createUserDto)
        return res.status(HttpStatus.OK).json(data)
    }

    @Get()
    async findMany(@Query('role') role: string, @Res() res: Response) {
        const data = await this.userService.findMany(role)
        return res.status(HttpStatus.OK).json(data)
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        const data =  await this.userService.findOne(id)
        return res.status(HttpStatus.OK).json(data)
    }

    @Delete()
    async delete(@Param('id') id: string, @Res() res: Response) {
        const data = await this.userService.delete(id)
        return res.status(HttpStatus.OK).json(data)
    }
}