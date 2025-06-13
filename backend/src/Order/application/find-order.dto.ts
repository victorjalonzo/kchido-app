import { IsArray, IsOptional } from "class-validator"
import { Transform } from "class-transformer"
import { OrderStatus } from "../domain/order.entity"

export class FindOrderDto {
    @IsOptional()
    userId?: string

    @IsOptional()
    raffleId?: string

    @IsOptional()
    status?: OrderStatus

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => Array.isArray(value) ? value : [value])
    include?: string[]
}