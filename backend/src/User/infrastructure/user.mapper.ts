import { Users } from "@prisma/client";
import { User, UserType } from "../domain/user.entity";

export class UserMapper {
    static toDomain = (raw: Users) => {
        const role = <UserType>raw.role
        const permissions = null

        return new User({
            ...raw,
            permissions,
            role 
        })
    }
}