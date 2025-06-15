import {ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus} from '@nestjs/common';
import { Response } from 'express';
import { InternalServerError } from '../../Shared/shared.exception';
import { OrderNotFound } from '../domain/order.exception';
  
@Catch()
export class OrderExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        console.log(exception)
        
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof OrderNotFound) {
            return response.status(HttpStatus.NOT_FOUND).json({
                message: exception.message,
            });
        }

        const status =
        exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
        exception instanceof HttpException
            ? exception.getResponse()
            : new InternalServerError().message;

        return response.status(status).json({
            message,
        });
    }
}