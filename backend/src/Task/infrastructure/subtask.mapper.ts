
import { SubTasks as PrismaSubTask } from "@prisma/client";
import { TaskStatus } from "../domain/task.entity";
import { SubTask } from "../domain/subtask.entity";

export class SubTaskMapper {
    static toDomain = (raw: PrismaSubTask) => {

        return new SubTask({
            ...raw,
            status: raw.status as TaskStatus,
        })
    }
}