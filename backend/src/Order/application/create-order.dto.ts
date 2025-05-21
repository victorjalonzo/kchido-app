import { IsNumber, IsString } from "class-validator"

export class CreateOrderDTO {
    @IsString()
    userId: string

    @IsNumber()
    total: number

    @IsString()
    paymentMethod: string
}