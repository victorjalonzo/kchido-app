import { IsDate, IsDateString, IsIn, IsNumber, IsString } from "class-validator"
import { RaffleStatus } from "../domain/raffle.entity"

export class CreateRaffleDTO {
    @IsString()
    name!: string

    @IsString()
    image?: String

    @IsString()
    description?: string

    @IsNumber()
    pricePeerTicket!: number

    @IsNumber()
    initialAmount!: number

    @IsIn(['active', 'inactive'])
    status!: Omit<RaffleStatus, 'finalized'>

    @IsString()
    createdBy: string

    @IsDateString()
    endsAt: Date
}