import {Injectable} from "@nestjs/common"
import { User } from "../domain/user.type.js"
import { UserRepository } from "../infrastructure/user.repository.js"
import { UserNotFoundException } from "../domain/user.exceptions.js"

@Injectable()
export class UserService {
    constructor(private readonly repository: UserRepository){}

    findOne = async (id: string): Promise<User> => {
        return await this.repository.findOne({ id })
        .then(user => {
            if (!user) throw new UserNotFoundException()
            return user
        })
    }

    findMany = async (role?: string): Promise<User[]> => {
        return await this.repository.findMany({role})
    }
}