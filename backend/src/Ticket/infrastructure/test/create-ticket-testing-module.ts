import { Test } from "@nestjs/testing"
import { SharedModule } from "src/Shared/shared.module"
import { TicketService } from "src/Ticket/application/ticket.service"
import { TicketController } from "../ticket.controller"

export const createTicketModuleTesting = async () => {
    return await Test.createTestingModule({
        imports: [SharedModule],
        providers: [TicketService],
        controllers: [TicketController],
        exports: [TicketService]
    })
    .compile()
}