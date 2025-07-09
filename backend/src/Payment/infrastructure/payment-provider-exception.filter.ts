import {ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus} from '@nestjs/common';
import { Response } from 'express';
import { InternalServerError } from '../../Shared/shared.exception';
import { PaymentProviderNotFound } from '../domain/payment-provider.exceptions';
  
@Catch()
export class PaymentProviderExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof PaymentProviderNotFound) {
            return response.status(HttpStatus.NOT_FOUND).json({
                message: exception.message,
            });
        }

        console.log(exception)

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