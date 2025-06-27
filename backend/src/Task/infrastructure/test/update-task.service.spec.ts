import { TaskService } from "src/Task/application/task.service";
import { createTaskTestingModule } from "./create-task-testing-module";
import { UpdateTaskDto } from "src/Task/application/update-task.dto";
import { Task, TaskStatus } from "src/Task/domain/task.entity";

describe("TaskService: update", () => {
    let service: TaskService | null = null

    beforeAll(async () => {
        const module = await createTaskTestingModule()
        service = module.get(TaskService)
    })

    const updateTaskDto: UpdateTaskDto = {
        id: '6dbc317a-b398-4522-8ce7-4781a5984a84',
        status: TaskStatus.COMPLETED,
    }

    it('should update a record', async () => {
        const task = await service?.update(updateTaskDto)
        expect(task).toBeInstanceOf(Task)
    })
})