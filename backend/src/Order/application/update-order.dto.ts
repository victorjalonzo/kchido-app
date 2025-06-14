import { IsString } from "class-validator"

export class UpdateOrderDTO {
    @IsString()
    id: string

    @IsString()
    status: number
}