import { TaskService } from "src/Task/application/task.service"
import { createTaskTestingModule } from "./create-task-testing-module"
import { CreateTaskDto } from "src/Task/application/create-task.dto"
import { Task, TaskType } from "src/Task/domain/task.entity"

describe('TaskService: create', () => {
    let service: TaskService

    beforeAll(async () => {
        const module = await createTaskTestingModule()
        service = module.get(TaskService)
    })

    const createTaskDto: CreateTaskDto = {
        type: TaskType.PAYMENT_COMPLETED,
        orderId: 'b8d8ebf8-56d1-4ea7-9682-6600ea421ecb'
    }

    it('should create a task', async () => {
        const task = await service.create(createTaskDto)
        expect(task).toBeInstanceOf(Task)
    })
    
})