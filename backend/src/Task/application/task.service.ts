import { Injectable } from "@nestjs/common";
import { SharedRepository } from "src/Shared/shared.repository";
import { Tasks as PrismaTask, SubTasks as PrismaSubTask, Users as PrismaUser } from "@prisma/client";
import { CreateTaskDto } from "./create-task.dto";
import { Task, TaskStatus, TaskType } from "../domain/task.entity";
import { Model } from "src/Shared/shared.types";
import { TaskMapper } from "../infrastructure/task.mapper";
import { RaffleHasNoParticipantsException, TaskNotFoundException } from "../domain/task.exception";
import { UpdateTaskDto } from "./update-task.dto";
import { TaskDispatcher } from "./task.dispatcher";
import { CreateSubTaskDto } from "./create-subtask.dto";
import { TicketService } from "src/Ticket/application/ticket.service";
import { RaffleService } from "src/Raffle/application/raffle.service";
import { SubTaskService } from "./subtask.service";
import { Raffle } from "src/Raffle/domain/raffle.entity";
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
        private readonly raffleService: RaffleService,
        private readonly ticketService: TicketService,
        private readonly orderService: OrderService,
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
        let raffle: Raffle | null = null

        if (dto.type == TaskType.RAFFLE_ENDED) {
            raffle = await this.raffleService.findById(<string>dto.raffleId, { participants: true })
            if (!raffle.participants.length) throw new RaffleHasNoParticipantsException()
        }

        const record = await this.repository.transaction(async (tx) => {
            if (!dto.status) dto.status = TaskStatus.PENDING

            return await tx[this.model].create({ data: dto })
            .then(async (record: PrismaTask) => {
                const createSubTaskDtos: CreateSubTaskDto[] = []

                switch(record.type) {
                    case TaskType.PAYMENT_COMPLETED:
                        const tickets = await this.ticketService.findByOrder(<string>record.orderId)
                        const order = await this.orderService.findById(<string>record.orderId)
                        const customerId = order.userId
    
                        for (const ticket of tickets) {
                            const createSubTaskDto: CreateSubTaskDto = {
                                taskId: record.id,
                                ticketId: ticket.id,
                                customerId: customerId
                            }
                            createSubTaskDtos.push(createSubTaskDto)
                        }
                        break;
    
                    case TaskType.RAFFLE_ENDED:
                        for (const participant of (raffle as Raffle).participants) {
                            const createSubTaskDto: CreateSubTaskDto = {
                                taskId: record.id, 
                                customerId: participant.id,
                            }
                            createSubTaskDtos.push(createSubTaskDto)
                        }
                        break;
                }
    
                await this.subTaskService.createMany(createSubTaskDtos, { transaction: tx})

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