import { IsIn, IsObject, IsOptional, IsString } from "class-validator";
import { CreatePermissionDTO } from "src/Permission/application/create-permission.dto";
import { UserType } from "../domain/user.entity";

export class CreateUserDTO {
    @IsString()
    name: string

    @IsString()
    @IsIn([
        UserType.CUSTOMER,
        UserType.SELLER
    ])
    role: UserType

    @IsOptional() @IsString()
    image?: string

    @IsOptional() @IsString()
    number?: string

    @IsOptional() @IsString()
    contactNumber?: string

    @IsOptional() @IsString()
    email?: string

    @IsOptional() @IsString()
    password?: string

    @IsOptional() @IsObject()
    permissions?: CreatePermissionDTO

    @IsOptional() @IsString()
    country?: string

    @IsOptional() @IsString()
    state?: string

    @IsOptional() @IsString()
    creatorId?: string

    @IsOptional() @IsString()
    shortId?: string
}