import { Response } from 'express';
import { UserNotFoundException } from "../domain/user.exceptions.js"
import {HttpStatus} from "@nestjs/common"

export const handleUserResponseException = async (res: Response, e: any) => {
    if (e instanceof UserNotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({message: e.message})
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: String(e)})
}