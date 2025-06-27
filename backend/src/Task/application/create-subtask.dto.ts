import { TaskStatus, TaskType } from "../domain/task.entity"

export interface CreateSubTaskDto {
    taskId: string 
    status?: TaskStatus
    customerId?: string
    ticketId?: string 
}