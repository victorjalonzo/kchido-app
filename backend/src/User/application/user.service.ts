import {Injectable} from "@nestjs/common"
import { PasswordMismatchException, UserNotFoundException } from "../domain/user.exceptions"
import { SharedRepository } from "../../Shared/shared.repository"
import { Model } from "../../Shared/shared.types"
import { CreateUserDTO } from "./create-user.dto"
import { PermissionService } from "src/Permission/application/permission.service"
import { Permissions as PrismaPermission, Tickets as PrismaTicket, Users as PrismaUser } from "@prisma/client"
import { UserMapper } from "../infrastructure/user.mapper"
import { User } from "../domain/user.entity"
import { UpdateUserDTO } from "./update-user.dto"
import { UserRole } from "../domain/user-role.enum"
import { UpdateMeDTO } from "src/Auth/application/update-me.dto"
import { UserShortIdGenerator } from "../infrastructure/util/user-shortId-generator"
import * as fs from 'fs';
import { UserImageUploader } from "../infrastructure/util/user-image-uploader"

export interface IncludeUsersRelationValues {
    permissions?: PrismaPermission,
    tickets?: PrismaTicket[]
}

export interface FindUserFilter {
    id?: string
    role?: UserRole
    email?: string,
    creatorId?: string
}

export interface UserJoinOptions {
    permissions?: boolean
}

@Injectable()
export class UserService {  
    model: Model = Model.USERS

    constructor(
        private readonly repository: SharedRepository<PrismaUser>,
        private readonly permissionService: PermissionService
    ){}

    create = async (dto: CreateUserDTO): Promise<User> => {
        const { permissions, image, ...data } = dto

        data.shortId = UserShortIdGenerator.generate(data.role)

        return await this.repository.create(this.model, data)
        .then(async record => {

            const user = image
            ? await this.update({id: record.id, image })
            : UserMapper.toDomain(record)

            if (permissions) {
                permissions.userId = user.id

                user.permissions = await this.permissionService.create(permissions)
                .catch(_ => null)
            }

            return user
        })
    }

    getProfilePhoto = async (id: string) => {
        const user = await this._find({ id }, {}, { keepRawRecord: true })
        const profilePhotoPath = user.image

        if (!profilePhotoPath) throw Error('No profile photo path found.')

        if (!fs.existsSync(profilePhotoPath)) {
          throw new Error('Profile image file missing.');
        }
    
        return profilePhotoPath;
    }

    updateSelf = async (id: string, dto: UpdateMeDTO, include?: Record<any, any>): Promise<User> => {
        const data: UpdateUserDTO = {id, ...dto}
        return await this.update(data, include)
    }

    update = async (dto: UpdateUserDTO, include?: Record<any, any>): Promise<User> => {
        const { permissions: permissionDTO, ...updateUserDTO } = dto
        const { id, ...data } = updateUserDTO

        if (data.newPassword) {
            await this.findById(id).then(user => {
                if (data.password != user.password) throw new PasswordMismatchException()
                data.password = data.newPassword
                
                delete data.newPassword
            })
        }

        if (data.image) {
            data.image = UserImageUploader.save(id, data.image)
        }

        return await this.repository.update(this.model, data, { id }, include)
        .then( async record => {
            if (!record) throw new UserNotFoundException()
            const user = UserMapper.toDomain(record)

            if (permissionDTO) {
                permissionDTO.userId = user.id

                await this.permissionService.upsertByUser(permissionDTO)
                .then(permission => user.permissions = permission)
            }
            return user
        })

    }

    findByEmail = async (email: string): Promise<User> => {
        return <User> await this._find({ email })
    }

    findById = async (id: string, includes?: UserJoinOptions): Promise<User> => {
        return <User> await this._find({ id }, includes)
    }

    findOne = async (filters: FindUserFilter, includes: UserJoinOptions): Promise<User> => {
        return <User> await this._find(filters, includes)
    }

    findWithScope = async (requesterId: string, filters: FindUserFilter, includes: UserJoinOptions) => {
        const requester = await this.findById(requesterId)
        if (requester.isAdmin || requester.isChatbot) return await this.findOne(filters, includes)
        
        return await this.findOne({...filters, creatorId: requester.id},  includes)
    }

    findManyWithScope = async (requesterId: string, filters: FindUserFilter, includes: UserJoinOptions) => {
        const requester = await this.findById(requesterId)
        if (requester.isAdmin || requester.isChatbot) return await this._findMany(filters, includes)
        
        return await this._findMany({...filters, creatorId: requester.id},  includes)
    }

    deleteWithScope = async (requesterId: string, id: string) => {
        const requester = await this.findById(requesterId)
        if (requester.isAdmin || requester.isChatbot) return await this.delete(id)

        return await this._delete({id, creatorId: requester.id })
    }

    findMany = async (filters: FindUserFilter, includes: UserJoinOptions): Promise<User[]> => {
        return await this._findMany(filters, includes)
    }

    delete = async (id: string): Promise<User> => {
        return await this.repository.delete(this.model, {id})
        .then(record => {
            if (!record) throw new UserNotFoundException()

            return UserMapper.toDomain(record)
        })
    }

    _find = async (filters?: FindUserFilter, includes?: UserJoinOptions, options?: {keepRawRecord: boolean}): Promise<User | PrismaUser> => {
        return await this.repository.findOne(this.model, filters, includes)
        .then((record: (PrismaUser & IncludeUsersRelationValues)) => {
            if (!record) throw new UserNotFoundException()
            return !options?.keepRawRecord 
            ? UserMapper.toDomain(record)
            : record
        })
    }

    _findMany = async (filters?: FindUserFilter, includes?: UserJoinOptions): Promise<User[]> => {
        return await this.repository.findMany(this.model, filters, includes)
        .then((records: (PrismaUser & IncludeUsersRelationValues)[]) => records.map(record => UserMapper.toDomain(record)))
    }

    _delete = async (filters: FindUserFilter, options?: {keepRawRecord: boolean}): Promise<User | PrismaUser> => {
        return await this.repository.delete(this.model, filters)
        .then((record: (PrismaUser & IncludeUsersRelationValues)) => {
            if (!record) throw new UserNotFoundException()
            return !options?.keepRawRecord 
            ? UserMapper.toDomain(record)
            : record
        })
    }
}