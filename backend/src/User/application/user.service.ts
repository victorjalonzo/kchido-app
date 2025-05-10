import {Injectable} from "@nestjs/common"
import { User } from "../domain/user.type.js"
import { UserNotFoundException } from "../domain/user.exceptions.js"
import { SharedRepository } from "../../Shared/shared.repository.js"
import { Model } from "../../Shared/shared.types.js"

@Injectable()
export class UserService {
    model: Model = Model.USERS

    constructor(private readonly repository: SharedRepository<User>){}

    findOne = async (id: string): Promise<User> => {
        return await this.repository.findOne(this.model, { id })
        .then(user => {
            if (!user) throw new UserNotFoundException()
            return user
        })
    }

    findMany = async (role?: string): Promise<User[]> => {
        return await this.repository.findMany(this.model, {role})
    }

    delete = async (id: string): Promise<User> => {
        return await this.repository.delete(this.model, {id})
        .then(user => {
            if (!user) throw new UserNotFoundException()
            return user
        })
    }
}