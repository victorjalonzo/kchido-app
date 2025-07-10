import { Orders } from "@prisma/client";
import { Order, OrderStatus } from "../domain/order.entity";
import { Ticket } from "src/Ticket/domain/ticket.entity";
import { IncludeOrdersRelationValues } from "../application/order.service";
import { User } from "src/User/domain/user.entity";
import { Raffle } from "src/Raffle/domain/raffle.entity";
import { UserMapper } from "src/User/infrastructure/user.mapper";
import { RaffleMapper } from "src/Raffle/infrastructure/raffle.mapper";
import { TicketMapper } from "src/Ticket/infrastructure/ticket.mapper";
import { TicketReservation } from "src/TicketReservation/domain/ticket-reservation.entity";
import { TicketReservationMapper } from "src/TicketReservation/infrastructure/ticke-reservation.mapper";
import { PublicOrder } from "../domain/public-order.entity";
import { PublicRaffle } from "src/Raffle/domain/public-raffle.entity";

export class OrderMapper {
    static toDomain = (raw: Orders & IncludeOrdersRelationValues) => {
        let user: User | undefined = undefined
        let raffle: Raffle | undefined = undefined
        let tickets: Ticket[] | undefined = undefined
        let ticketReservations: TicketReservation[] | undefined = undefined

        if (raw.user) user = UserMapper.toDomain(raw.user)
        if (raw.raffle) raffle = RaffleMapper.toDomain(raw.raffle)
        if (raw.tickets) tickets = raw.tickets.map(ticket => TicketMapper.toDomain(ticket))
        if (raw.ticketReservations) ticketReservations = raw.ticketReservations.map(ticket => TicketReservationMapper.toDomain(ticket))

        return new Order({
            ...raw,
            status: (raw.status as OrderStatus),
            user: user,
            raffle,
            tickets,
            ticketReservations
        })
    }

    static toPublicDomain = (raw: Orders & IncludeOrdersRelationValues) => {
        let raffle: PublicRaffle | undefined = undefined
        let tickets: Ticket[] | undefined = undefined
        let ticketReservations: TicketReservation[] | undefined = undefined

        if (raw.raffle) raffle = RaffleMapper.toPublicDomain(raw.raffle)
        if (raw.tickets) tickets = raw.tickets.map(ticket => TicketMapper.toDomain(ticket))
        if (raw.ticketReservations) ticketReservations = raw.ticketReservations.map(ticket => TicketReservationMapper.toDomain(ticket))

        return new PublicOrder({
            ...raw,
            status: (raw.status as OrderStatus),
            raffle,
            tickets,
            ticketReservations
        })
    }
}