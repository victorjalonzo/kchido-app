import { Injectable } from "@nestjs/common";
import { SharedRepository } from "src/Shared/shared.repository";
import { Tasks as PrismaTask, SubTasks as PrismaSubTask, Users as PrismaUser } from "@prisma/client";
import { CreateTaskDto } from "./create-task.dto";
import { Task, TaskStatus, TaskType } from "../domain/task.entity";
import { Model } from "src/Shared/shared.types";
import { TaskMapper } from "../infrastructure/task.mapper";
import { TaskNotFoundException } from "../domain/task.exception";
import { UpdateTaskDto } from "./update-task.dto";
import { TaskDispatcher } from "./task.dispatcher";
import { CreateSubTaskDto } from "./create-subtask.dto";
import { TicketService } from "src/Ticket/application/ticket.service";
import { SubTaskService } from "./subtask.service";
import { OrderService } from "src/Order/application/order.service";
import { SubTasksIncompleteException } from "../domain/subtask.exception";

export interface TaskRelationFields {
    subTasks?: PrismaSubTask[]
    customer?: PrismaUser
}

export interface TaskRelationOptions {
    subTasks?: boolean
    customer?: boolean
}

@Injectable()
export class TaskService {
    model: Model = Model.TASKS

    constructor (
        private readonly repository: SharedRepository<PrismaTask>,
        private readonly subTaskService: SubTaskService,
        private readonly ticketService: TicketService,
        private readonly dispatcher: TaskDispatcher
    ){}

    create = async (dto: CreateTaskDto): Promise<Task> => {
        return await this._create(dto)
        .then(async task => {
            this.dispatcher.dispatchToChatbot(task)
            .catch(async _ => {
                console.log("Task couldn't be delivered.")

                const dto: UpdateTaskDto = {
                    id: task.id,
                    status: TaskStatus.PENDING
                }

                return await this.update(dto)
            })

            return task;
        })
    }

    _create = async (dto: CreateTaskDto): Promise<Task> => {
        const record = await this.repository.transaction(async (tx) => {
            if (!dto.status) dto.status = TaskStatus.PENDING

            return await tx[this.model].create({ data: dto })
            .then(async (record: PrismaTask) => {

                if (record.type == TaskType.PAYMENT_COMPLETED) {
                    const createSubTaskDtos: CreateSubTaskDto[] = []

                    const tickets = await this.ticketService.findByOrder(<string>record.orderId)
    
                    for (const ticket of tickets) {
                        const createSubTaskDto: CreateSubTaskDto = {
                            taskId: record.id,
                            ticketId: ticket.id,
                            customerId: dto.customerId
                        }
                        createSubTaskDtos.push(createSubTaskDto)
                    }
                    await this.subTaskService.createMany(createSubTaskDtos, { transaction: tx})
                }

                return record;
            })
        })

        return await this._find({id: record.id}, { subTasks: true, customer: true })
    }

    update = async (dto: UpdateTaskDto): Promise<Task> => {
        if (dto.status == TaskStatus.COMPLETED) {
            const task = await this._find({ id: dto.id }, { subTasks: true })
            if (!task.areSubTasksCompleted) throw new SubTasksIncompleteException()
        }
    
        return await this._update(dto)
    }

    find = async (filter?: Record<string, any>, include?: TaskRelationOptions) => {
        return await this._find(filter, include)
    }

    findMany = async (filter?: Record<string, any>, include?: TaskRelationOptions) => {
        return await this._findMany(filter, include)
    }

    delete = async (id: string) => {
        return await this._delete({ id })
    }

    _update = async (dto: UpdateTaskDto): Promise<Task> => {
        const data = {...dto, updatedAt: new Date()}

        return await this.repository.update(this.model, data, { id: data.id })
        .then(record => {
            if (!record) throw new TaskNotFoundException()
            return TaskMapper.toDomain(record)
        })
    }

    _find = async (filter?: Record<string, any>, include?: TaskRelationOptions) => {
        return await this.repository.findOne(this.model, filter, include)
        .then((record: PrismaTask & TaskRelationFields) => {
            if (!record) throw new TaskNotFoundException()
            return TaskMapper.toDomain(record)
        })
    }

    _findMany = async (filter?: Record<string, any>, include?: TaskRelationOptions) => {
        return await this.repository.findMany(this.model, filter, include)
        .then(records => records.map(record => TaskMapper.toDomain(record)))
    }

    _delete = async (filters: Record<string, any>) => {
        return await this.repository.delete(this.model, filters)
        .then(record => {
            if (!record) throw new TaskNotFoundException()
            return TaskMapper.toDomain(record)
        })
    }
}