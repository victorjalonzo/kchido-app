import { IsNumber, IsOptional, IsString } from "class-validator"

export class CreateTicketDTO {
    @IsString()
    serial: string

    @IsString()
    raffleId: string

    @IsString()
    userId: string

    @IsString()
    orderId: string

    @IsNumber()
    price: number

    @IsOptional() @IsString()
    shortId?: string
}