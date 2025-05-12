import { Permissions } from "@prisma/client"
import { Permission } from "../domain/permission.entity"

export class PermissionMapper {
    static toDomain = (raw: Permissions) => {
        return new Permission({...raw})
    }
}