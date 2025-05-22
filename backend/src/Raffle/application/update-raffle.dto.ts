import { IsArray, IsDateString, IsIn, IsNumber, IsOptional, IsString } from "class-validator"
import { RaffleStatus } from "../domain/raffle.entity"

export class UpdateRaffleDTO {
    @IsString()
    id: string

    @IsOptional() @IsString()
    name?: string

    @IsOptional() @IsString()
    image?: String

    @IsOptional() @IsString()
    description?: string

    @IsOptional() @IsNumber()
    pricePeerTicket?: number

    @IsOptional() @IsNumber()
    initialAmount?: number

    @IsOptional() @IsIn([RaffleStatus.PUBLIC, RaffleStatus.PRIVATE, RaffleStatus.FINALIZED])
    status?: RaffleStatus

    @IsOptional() @IsArray()
    winnerNumbers?: string[]

    @IsOptional() @IsDateString()
    endsAt?: Date
}