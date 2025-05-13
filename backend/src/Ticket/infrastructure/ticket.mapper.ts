import { Tickets } from "@prisma/client";
import { Ticket } from "../domain/ticket.entity";

export class TicketMapper {
    static toDomain(raw: Tickets): Ticket {
        return new Ticket({...raw})
    }
}