import { Module } from "@nestjs/common";
import { SharedModule } from "src/Shared/shared.module";
import { TicketReservationService } from "../application/ticket-reservation.service";

@Module({
    imports: [SharedModule],
    providers: [TicketReservationService],
    exports: [TicketReservationService]
})
export class TicketReservationModule {}