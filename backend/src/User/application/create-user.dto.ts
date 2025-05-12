import { IsObject, IsString } from "class-validator";
import { CreatePermissionDTO } from "src/Permission/application/create-permission.dto";

export class CreateUserDTO {
    @IsString()
    name: string

    @IsString()
    role: string

    @IsString()
    number?: string

    @IsString()
    email?: string

    @IsObject()
    permissions?: CreatePermissionDTO
}