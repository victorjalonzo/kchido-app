import { IsArray, IsOptional, IsString } from "class-validator"
import { Transform } from "class-transformer"
import { RaffleStatus } from "../domain/raffle.entity"

export class FindRaffleDto {
    @IsOptional() @IsString()
    createdBy: string

    @IsOptional() @IsString()
    status?: RaffleStatus

    @IsOptional() @IsString()
    visibility: string 

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => Array.isArray(value) ? value : [value])
    include?: string[]
}