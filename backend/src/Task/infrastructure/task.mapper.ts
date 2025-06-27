import { Tasks as PrismaTask} from "@prisma/client";
import { Task, TaskStatus, TaskType } from "../domain/task.entity";
import { TaskRelationFields } from "../application/task.service";
import { SubTaskMapper } from "./subtask.mapper";
import { UserMapper } from "src/User/infrastructure/user.mapper";

export class TaskMapper {
    static toDomain = (raw: PrismaTask & TaskRelationFields) => {
        const subTasks = raw.subTasks ? raw.subTasks.map(subtask =>  SubTaskMapper.toDomain(subtask)) : []
        const customer = raw.customer ? UserMapper.toDomain(raw.customer) : undefined

        return new Task({
            ...raw,
            type: raw.type as TaskType,
            status: raw.status as TaskStatus,
            subTasks,
            customer
        })
    }
}