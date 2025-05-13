import { Module } from "@nestjs/common";
import { SharedModule } from "src/Shared/shared.module";
import { TicketService } from "../application/ticket.service";

@Module({
    imports: [SharedModule],
    providers: [TicketService]
})
export class TicketModule {}