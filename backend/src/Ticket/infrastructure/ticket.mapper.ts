import { Tickets } from "@prisma/client";
import { Ticket } from "../domain/ticket.entity";
import { IncludeTicketsRelationValues } from "../application/ticket.service";
import { UserMapper } from "src/User/infrastructure/user.mapper";
import { RaffleMapper } from "src/Raffle/infrastructure/raffle.mapper";
import { OrderMapper } from "src/Order/infrastructure/order.mapper";

export class TicketMapper {
    static toDomain(raw: Tickets & IncludeTicketsRelationValues): Ticket {
        const user = raw.user ? UserMapper.toDomain(raw.user) : undefined
        const raffle = raw.raffle ? RaffleMapper.toDomain(raw.raffle) : undefined
        const order = raw.order ? OrderMapper.toDomain(raw.order) : undefined

        return new Ticket({
            ...raw,
            receiptPath: <string>raw.receiptPath,
            user,
            raffle,
            order
        })
    }
}