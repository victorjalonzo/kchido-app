import { Transform } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../domain/task.entity";

export class FindSubTaskDto {
    @IsOptional()
    raffleId?: string

    @IsString() @IsOptional()
    status?: TaskStatus

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => Array.isArray(value) ? value : [value])
    include?: string[]
}