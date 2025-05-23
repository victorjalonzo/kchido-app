import { Users } from "@prisma/client";
import { User, UserStatus, UserType } from "../domain/user.entity";

export class UserMapper {
    static toDomain = (raw: Users) => {
        const role = <UserType>raw.role
        const status = <UserStatus>raw.status
        const permissions = null

        return new User({
            ...raw,
            permissions,
            role, 
            status
        })
    }
}