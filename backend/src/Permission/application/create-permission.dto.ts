import { IsBoolean, IsString } from "class-validator"

export class CreatePermissionDTO {
    @IsString()
    userId?: string

    @IsBoolean()
    manageRaffles?: boolean

    @IsBoolean()
    manageSellers?: boolean

    @IsBoolean()
    manageTickets?: boolean

    @IsBoolean()
    manageChatbot?: boolean

    @IsBoolean()
    managePaymentMethods?: boolean

    @IsBoolean()
    manageCustomers?: boolean

    @IsBoolean()
    manageOrders?: boolean
} 