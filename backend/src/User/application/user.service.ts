import {Injectable} from "@nestjs/common"
import { User } from "../domain/user.type.js"
import { Repository } from "../../Shared/domain/repository.type.js"
import { UserRepository } from "../infrastructure/user.repository.js"
import { UserNotFoundException } from "../domain/user.exceptions.js"

@Injectable()
export class UserService {
    constructor(private readonly repository: UserRepository){}

    findOne = async (id: string): Promise<User> => {
        return await this.repository.get({ id })
        .then(r => {
            if (!r) throw new UserNotFoundException()
            return r
        })
    }
}