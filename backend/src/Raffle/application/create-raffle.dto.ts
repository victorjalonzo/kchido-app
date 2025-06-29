import { IsDateString, IsIn, IsNumber, IsOptional, IsString } from "class-validator"
import { RaffleStatus, RaffleVisibility } from "../domain/raffle.entity"

export class CreateRaffleDTO {
    @IsString()
    name: string

    @IsOptional() @IsString()
    image?: string

    @IsOptional() @IsString()
    description?: string

    @IsNumber()
    pricePeerTicket: number

    @IsNumber()
    initialAmount!: number

    @IsIn([RaffleVisibility.PUBLIC, RaffleVisibility.PRIVATE])
    visibility: RaffleVisibility

    @IsOptional() @IsString()
    creatorId?: string

    @IsDateString()
    endsAt: Date

    @IsOptional() @IsString()
    shortId?: string 
}