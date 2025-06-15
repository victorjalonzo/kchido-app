import { Module } from "@nestjs/common";
import { OrderService } from "../application/order.service";
import { OrderController } from "./order.controller";
import { SharedModule } from "src/Shared/shared.module";
import { TicketModule } from "src/Ticket/infrastructure/ticket.module";
import { TicketReservationModule } from "src/TicketReservation/infrastructure/ticket-reservation.module";
import { RaffleModule } from "src/Raffle/infrastructure/raffle.module";

@Module({
    imports: [
        SharedModule,
        RaffleModule,
        TicketModule, 
        TicketReservationModule
    ],
    providers: [OrderService],
    controllers: [OrderController],
    exports: [OrderService]
})
export class OrderModule {}