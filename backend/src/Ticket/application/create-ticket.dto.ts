import { IsString } from "class-validator"

export class CreateTicketDTO {
    @IsString()
    serial: string

    @IsString()
    raffleId: string 
}