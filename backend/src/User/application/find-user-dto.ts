import { IsArray, IsOptional } from "class-validator"
import { Transform } from "class-transformer"
import { UserRole } from "../domain/user-role.enum"

export class FindUserDto {
    @IsOptional()
    role?: UserRole

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => Array.isArray(value) ? value : [value])
    include?: string[]
}