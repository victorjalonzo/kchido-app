import { Module } from "@nestjs/common";
import { SharedModule } from "src/Shared/shared.module";
import { TicketService } from "../application/ticket.service";
import { TicketController } from "./ticket.controller";

@Module({
    imports: [SharedModule],
    providers: [TicketService],
    controllers: [TicketController],
    exports: [TicketService]
})
export class TicketModule {}