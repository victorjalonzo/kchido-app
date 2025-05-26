import { IsArray, IsOptional } from "class-validator"
import { Transform } from "class-transformer"

export class FindTicketDTO {
    @IsOptional()
    userId?: string

    @IsOptional()
    raffleId?: string

    @IsOptional()
    orderId?: string 

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => Array.isArray(value) ? value : [value])
    include?: string[]
}