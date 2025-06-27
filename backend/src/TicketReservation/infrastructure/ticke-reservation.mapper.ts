import { TicketReservations as PrismaTicketReservation } from "@prisma/client";
import { TicketReservation } from "../domain/ticket-reservation.entity";

export class TicketReservationMapper {
    static toDomain = (raw: PrismaTicketReservation) => {
        return new TicketReservation(raw)
    }
}