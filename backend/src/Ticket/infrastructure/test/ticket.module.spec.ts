import { Test } from "@nestjs/testing";
import { TicketQRCode } from "../util/ticket.qrcode";
import { SharedModule } from "src/Shared/shared.module";
import { TicketService } from "../../application/ticket.service";
import { TicketController } from "../ticket.controller";


describe('Ticket QRCode Generator', () => {
    let service: TicketService
    let controller: TicketController

    beforeAll(async () => {
        const module = Test.createTestingModule({
            imports: [SharedModule],
            providers: [TicketService],
            controllers: [TicketController],
            exports: [TicketService]
        })

        await module.compile()
        .then(moduleInitialized => {
            service = moduleInitialized.get(TicketService)
            controller = moduleInitialized.get(TicketController)
        })
    })

    it('should return a QR image', async () => {
        const ticket = await service._find({})
        ticket.serial = '567321'

        const ticketPath = await TicketQRCode.generate(ticket)
        console.log(ticketPath)
        expect(typeof ticketPath).toBe('string')
    }, 90000)
})