import {Controller, Get, Param, Res, HttpStatus, Query, UseFilters} from "@nestjs/common"
import { UserService } from "../application/user.service.js"
import { Response } from 'express';
import { UserExceptionFilter } from "./user-exception.filter.js";

@UseFilters(UserExceptionFilter)
@Controller("api/v1/users")
export class UserController {
    constructor(private readonly userService: UserService){}

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
}