import { IsBoolean, IsOptional, IsString } from "class-validator"

export class UpdateChatbotConfigurationDto {
    @IsOptional() @IsBoolean()
    isOn?: boolean

    @IsOptional() @IsString()
    whatsAppGroupId?: string 
}