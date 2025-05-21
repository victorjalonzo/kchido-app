import { Orders, Tickets } from "@prisma/client";
import { Order, OrderStatus } from "../domain/order.entity";
import { Ticket } from "src/Ticket/domain/ticket.entity";

export class OrderMapper {
    static toDomain = (raw: Orders,  tickets?: Ticket[]) => {
        return new Order({
            ...raw,
            status: raw.status as OrderStatus,
            tickets: tickets ?? []
        })
    }
}