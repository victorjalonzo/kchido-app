import { IsDateString, IsIn, IsNumber, IsOptional, IsString } from "class-validator"
import { RaffleStatus } from "../domain/raffle.entity"

export class CreateRaffleDTO {
    @IsString()
    name: string

    @IsOptional() @IsString()
    image?: String

    @IsOptional() @IsString()
    description?: string

    @IsNumber()
    pricePeerTicket: number

    @IsNumber()
    initialAmount!: number

    @IsIn([RaffleStatus.PUBLIC, RaffleStatus.PRIVATE])
    status: Omit<RaffleStatus, RaffleStatus.FINALIZED>

    @IsOptional() @IsString()
    createdBy?: string

    @IsDateString()
    endsAt: Date
}