import { IsObject, IsOptional, IsString } from "class-validator";
import { CreatePermissionDTO } from "src/Permission/application/create-permission.dto";

export class CreateUserDTO {
    @IsString()
    name: string

    @IsString()
    role: string

    @IsOptional() @IsString()
    number?: string

    @IsOptional() @IsString()
    email?: string

    @IsOptional() @IsString()
    password?: string

    @IsOptional() @IsObject()
    permissions?: CreatePermissionDTO
}