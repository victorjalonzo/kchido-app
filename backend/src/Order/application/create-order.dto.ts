import { IsArray, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateOrderDTO {
    @IsString()
    raffleId: string 

    @IsArray()
    tickets: string[]

    @IsString()
    userId: string
    
    @IsString()
    paymentMethod: string

    @IsOptional() @IsString()
    status: string 
    
    @IsOptional() @IsNumber()
    total?: number

    @IsOptional() @IsNumber()
    quantity?: number

    @IsOptional() @IsString()
    assistedBy?: string 
}