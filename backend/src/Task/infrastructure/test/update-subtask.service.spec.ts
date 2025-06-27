import { SubTaskService } from "src/Task/application/subtask.service"
import { createTaskTestingModule } from "./create-task-testing-module"
import { UpdateSubTaskDto } from "src/Task/application/update-subtask.dto"
import { TaskStatus } from "src/Task/domain/task.entity"
import { SubTask } from "src/Task/domain/subtask.entity"

describe("SubTaskService: update", () => {
    let service: SubTaskService | null = null

    beforeAll(async () => {
        const module = await createTaskTestingModule()
        service = module.get(SubTaskService)
    })

    const updateTaskDto: UpdateSubTaskDto = {
        id: '1a809b6e-77f0-4376-88ce-7df97c9e612e',
        status: TaskStatus.COMPLETED,
    }

    it('should update a record', async () => {
        const task = await service?.update(updateTaskDto)
        expect(task).toBeInstanceOf(SubTask)
    })
})