import { IsIn, IsOptional, IsString } from "class-validator"
import { TaskStatus } from "../domain/task.entity"

export class UpdateSubTaskDto {
    @IsString()
    id: string

    @IsIn([
        TaskStatus.COMPLETED,
        TaskStatus.DELIVERING,
        TaskStatus.PENDING
    ])
    status: TaskStatus

    @IsString() @IsOptional()
    description?: string
}