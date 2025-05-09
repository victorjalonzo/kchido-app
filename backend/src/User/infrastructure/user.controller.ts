import {Controller, Get, Param, Res, HttpStatus, Query} from "@nestjs/common"
import { UserService } from "../application/user.service.js"
import { Response } from 'express';
import { handleUserResponseException } from "./user.util.js";

@Controller("api/v1/users")
export class UserController {
    constructor(private readonly userService: UserService){}

    @Get()
    async findMany(@Query('role') role: string, @Res() res: Response) {
        try {
            const data = await this.userService.findMany(role)
            return res.status(HttpStatus.OK).json(data)
        }
        catch(e) {
            return handleUserResponseException(res, e)
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        try {
            console.log(`received: ${id}`)
            const data =  await this.userService.findOne(id)
            
            return res.status(HttpStatus.OK).json(data)
        }
        catch(e) {
            return handleUserResponseException(res, e)
        }
    }
}