import { IsArray, IsDateString, IsIn, IsNumber, IsOptional, IsString } from "class-validator"
import { RaffleStatus, RaffleVisibility } from "../domain/raffle.entity"

export class UpdateRaffleDTO {
    @IsString()
    id: string

    @IsOptional() @IsString()
    name?: string

    @IsOptional() @IsString()
    image?: string

    @IsOptional() @IsString()
    description?: string

    @IsOptional() @IsNumber()
    pricePeerTicket?: number

    @IsOptional() @IsNumber()
    initialAmount?: number

    @IsOptional() @IsIn([RaffleStatus.ONGOING, RaffleStatus.ENDED])
    status?: RaffleStatus

    @IsOptional() @IsIn([RaffleVisibility.PUBLIC, RaffleVisibility.PRIVATE])
    visibility?: RaffleVisibility

    @IsOptional() @IsArray()
    winnerNumbers?: string[]

    @IsOptional() @IsString()
    whatsAppGroupId?: string 

    @IsOptional() @IsDateString()
    endsAt?: Date
}