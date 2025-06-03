import { IsOptional, IsString } from "class-validator";

export class UpdateMeDTO {
    @IsOptional() @IsString()
    name?: string;

    @IsOptional() @IsString()
    image?: string;
  
    @IsOptional() @IsString()
    number?: string;
  
    @IsOptional() @IsString()
    email?: string;
  
    @IsOptional() @IsString()
    password?: string;

    @IsOptional() @IsString()
    newPassword?: string;
}