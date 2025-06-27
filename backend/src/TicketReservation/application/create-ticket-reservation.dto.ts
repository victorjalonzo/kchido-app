import { IsString } from "class-validator"

export class CreateTicketReservationDTO {
    @IsString()
    serial: string

    @IsString()
    raffleId: string

    @IsString()
    userId: string 

    @IsString()
    orderId: string
}