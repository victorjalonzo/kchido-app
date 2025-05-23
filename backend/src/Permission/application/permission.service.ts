import { SharedRepository } from "src/Shared/shared.repository";
import { Permission } from "../domain/permission.entity";
import { Permissions } from "@prisma/client";
import { CreatePermissionDTO } from "./create-permission.dto";
import { Model } from "src/Shared/shared.types";
import { PermissionMapper } from "../infrastructure/permission.mapper";
import { Injectable } from "@nestjs/common";
import { PermissionNotFound } from "../domain/permission.exception";

@Injectable()
export class PermissionService {
    model: Model = Model.PERMISSIONS

    constructor (private readonly repository: SharedRepository<Permissions>){}

    create = async (dto: CreatePermissionDTO): Promise<Permission> => {
        return await this.repository.create(this.model, dto)
        .then(record => PermissionMapper.toDomain(record))
    }

    findByUser = async (userId: string): Promise<Permission> => {
        return await this.repository.findOne(this.model, { userId })
        .then(record => {
            if (!record) throw new PermissionNotFound()
            return PermissionMapper.toDomain(record)
        })
    }

    upsertByUser = async (dto: CreatePermissionDTO): Promise<Permission> => {
        return await this.repository.findOne(this.model, { userId: dto.userId})
        .then(async record => !record
            ? await this.repository.create(this.model, dto)
            : await this.repository.update(this.model, dto, { userId: dto.userId})
        )
        .then(record  => PermissionMapper.toDomain((record as Permissions)))
    }

    updateByUser = async (dto: CreatePermissionDTO): Promise<Permission> => {
        return await this.repository.update(this.model, dto, { userId: dto.userId})
        .then(record => {
            if (!record) throw new PermissionNotFound()
            return PermissionMapper.toDomain(record)
        })
    }

    deleteByUser = async (userId: string): Promise<Permission> => {
        return await this.repository.delete(this.model, { userId })
        .then(record => {
            if (!record) throw new PermissionNotFound()
            return PermissionMapper.toDomain(record)
        })
    }
}