import { Raffles as PrismaRaffle} from "@prisma/client"
import { Raffle, RaffleStatus, RaffleVisibility } from "../domain/raffle.entity"
import { RaffleIncludeValues } from "../application/raffle.service"
import { TicketMapper } from "src/Ticket/infrastructure/ticket.mapper"
import { OrderMapper } from "src/Order/infrastructure/order.mapper"
import { UserMapper } from "src/User/infrastructure/user.mapper"
import { sharedConfig } from "src/Shared/shared.config"

export class RaffleMapper {
    static toDomain = (raw: (PrismaRaffle & RaffleIncludeValues))  => {
        const status = raw.status as RaffleStatus
        const visibility = raw.visibility as RaffleVisibility

        const tickets = raw.tickets ? raw.tickets.map(ticket => TicketMapper.toDomain(ticket)) : undefined
        const orders = raw.orders ? raw.orders.map(order => OrderMapper.toDomain(order)) : undefined
        const participants = raw.participants ? raw.participants.map(participant => UserMapper.toDomain(participant)) : undefined
        const creator = raw.creator ? UserMapper.toDomain(raw.creator) : undefined


        raw.image = raw.image
        ? `${sharedConfig.appApiURL}/raffles/${raw.id}/image`
        : `${sharedConfig.appApiURL}/static/default/raffle-image.png`

 
        return new Raffle({
            ...raw,
            status,
            visibility,
            tickets,
            orders,
            participants,
            creator
        })
    }
}