import {Controller, Get, Param, Res, HttpStatus} from "@nestjs/common"
import { UserService } from "../application/user.service.js"
import { Response } from 'express';
import { UserNotFoundException } from "../domain/user.exceptions.js";

@Controller("api/v1/users")
export class UserController {
    constructor(private readonly userService: UserService){}

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        try {
            console.log(`received: ${id}`)
            const data =  await this.userService.findOne(id)
            
            return res.status(HttpStatus.OK).json(data)
        }
        catch(e) {
            if (e instanceof UserNotFoundException) {
                return res.status(HttpStatus.NOT_FOUND).json({message: e.message})
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: String(e)})
        }
    }
}