import { TaskStatus, TaskType } from "../domain/task.entity"

export interface CreateTaskDto {
    type: TaskType
    status?: TaskStatus
    description?: string
    orderId?: string
    raffleId?: string
}