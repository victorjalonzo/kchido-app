import {Injectable} from "@nestjs/common"
import { UserNotFoundException } from "../domain/user.exceptions"
import { SharedRepository } from "../../Shared/shared.repository"
import { Model } from "../../Shared/shared.types"
import { CreateUserDTO } from "./create-user.dto"
import { PermissionService } from "src/Permission/application/permission.service"
import { Users } from "@prisma/client"
import { UserMapper } from "../infrastructure/user.mapper"
import { User } from "../domain/user.entity"
import { UpdateUserDTO } from "./update-user.dto"
import { PermissionNotFound } from "src/Permission/domain/permission.exception"

@Injectable()
export class UserService {
    model: Model = Model.USERS

    constructor(
        private readonly repository: SharedRepository<Users>,
        private readonly permissionService: PermissionService
    ){}

    create = async (dto: CreateUserDTO): Promise<User> => {
        const { permissions, ...createUserDTO } = dto

        return await this.repository.create(this.model, createUserDTO)
        .then(async record => {
            const user = UserMapper.toDomain(record)

            if (permissions) {
                permissions.userId = user.id

                user.permissions = await this.permissionService.create(permissions)
                .catch(_ => null)
            }

            return user
        })
    }

    update = async (dto: UpdateUserDTO): Promise<User> => {
        const { permissions: permissionDTO, ...updateUserDTO } = dto
        const { id, ...data } = updateUserDTO

        return await this.repository.update(this.model, data, { id })
        .then( async record => {
            if (!record) throw new UserNotFoundException()
            const user = UserMapper.toDomain(record)

            console.log(permissionDTO)

            if (permissionDTO) {
                permissionDTO.userId = user.id

                await this.permissionService.upsertByUser(permissionDTO)
                .then(permission => user.permissions = permission)
            }
            return user
        })

    }

    findByEmail = async (email: string): Promise<User> => {
        return await this.repository.findOne(this.model, { email })
        .then( record => {
            if (!record) throw new UserNotFoundException()
            return UserMapper.toDomain(record)
        })
    }

    findOne = async (id: string): Promise<User> => {
        return await this.repository.findOne(this.model, { id })
        .then(record => {
            if (!record) throw new UserNotFoundException()
            return UserMapper.toDomain(record)
        })
    }

    findMany = async (role?: string): Promise<User[]> => {
        return await this.repository.findMany(this.model, {role})
        .then(records => {
            return records.map((record) => UserMapper.toDomain(record))
        })
    }

    delete = async (id: string): Promise<User> => {
        return await this.repository.delete(this.model, {id})
        .then(record => {
            if (!record) throw new UserNotFoundException()

            return UserMapper.toDomain(record)
        })
    }
}