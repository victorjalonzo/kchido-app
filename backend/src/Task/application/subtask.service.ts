import { Injectable } from "@nestjs/common";
import { SharedRepository } from "src/Shared/shared.repository";
import { CreateSubTaskDto } from "./create-subtask.dto";
import { UpdateSubTaskDto } from "./update-subtask.dto";
import { PrismaClient, SubTasks as PrismaSubTask } from "@prisma/client";
import { TaskStatus } from "../domain/task.entity";
import { Model } from "src/Shared/shared.types";
import { SubTaskMapper } from "../infrastructure/subtask.mapper";
import { SubTaskNotFoundException } from "../domain/subtask.exception";
import { SubTask } from "../domain/subtask.entity";

interface Options {
    transaction?: PrismaClient
}

@Injectable()
export class SubTaskService {
    model: Model = Model.SUBTASKS

    constructor(private readonly repository: SharedRepository<PrismaSubTask>) {}

    createMany = async (dtos: CreateSubTaskDto[], options: Options): Promise<{count: number}> => {
        const transaction = options?.transaction

        const subTasks: PrismaSubTask[] = []

        for (const dto of dtos) {
            if (!dto.status) dto.status = TaskStatus.PENDING

            const record = !transaction
            ? await this.repository.create(this.model, dto)
            : await transaction[this.model].create({ data: dto })

            subTasks.push(record)
        }

        return { count: subTasks.length }
    }

    create = async (dto: CreateSubTaskDto): Promise<SubTask> => {
        if (!dto.status) dto.status == TaskStatus.PENDING
        return await this.repository.create(this.model, dto)
        .then(record => SubTaskMapper.toDomain(record))
    }

    update = async (dto: UpdateSubTaskDto): Promise<SubTask> => {
        const {id, ...data} = dto

        return await this.repository.update(this.model, data, { id })
        .then((record) => {
            if (!record) throw new SubTaskNotFoundException()
            return SubTaskMapper.toDomain( record )
        })
    }

    find = async (filters?: Record<string, any>, includes?: Record<string, boolean>) => {
        return await this._find(filters, includes)
    }

    findMany = async (filters?: Record<string, any>, includes?: Record<string, boolean>) => {
        return await this._findMany(filters, includes)
    }

    delete = async (id: string) => {
        return await this._delete( { id })
    }

    _find = async (filters?: Record<string, any>, includes?: Record<string, boolean>): Promise<SubTask> => {
        return await this.repository.findOne(this.model, filters, includes)
        .then(record => {
            if (!record) throw new SubTaskNotFoundException()
            return SubTaskMapper.toDomain(record)
        })
    }

    _findMany = async (filters?: Record<string, any>, includes?: Record<string, boolean>) => {
        return await this.repository.findMany(this.model, filters, includes)
        .then(records => records.map(record => SubTaskMapper.toDomain(record)))
    }

    _delete = async (filters: Record<string, any>, includes?: Record<string, boolean>) => {
        return await this.repository.delete(this.model, filters)
        .then(record => {
            if (!record) throw new SubTaskNotFoundException()
            return SubTaskMapper.toDomain(record) 
        })
    }
}