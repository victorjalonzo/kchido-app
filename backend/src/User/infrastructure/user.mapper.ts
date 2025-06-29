import { Users } from "@prisma/client";
import { User, UserStatus, UserType } from "../domain/user.entity";
import { IncludeUsersRelationValues } from "../application/user.service";
import { PermissionMapper } from "src/Permission/infrastructure/permission.mapper";
import { TicketMapper } from "src/Ticket/infrastructure/ticket.mapper";
import { SharedConfig } from "src/Shared/shared.config";

export class UserMapper {
    static toDomain = (raw: (Users & IncludeUsersRelationValues)) => {
        const role = <UserType>raw.role
        const status = <UserStatus>raw.status

        const permissions = raw.permissions ? PermissionMapper.toDomain(raw.permissions) : null
        const tickets = raw.tickets ? raw.tickets.map(ticket => TicketMapper.toDomain(ticket)) : []

        if (raw.image) {
            raw.image = `${SharedConfig.apiURL}/users/${raw.id}/profile`
        }

        return new User({
            ...raw,
            role, 
            status,
            permissions,
            tickets
        })
    }
}