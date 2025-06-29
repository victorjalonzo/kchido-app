import { TicketService } from "src/Ticket/application/ticket.service"
import { createTicketModuleTesting } from "./create-ticket-testing-module"
import { TicketQRCode } from "../util/ticket.qrcode"

describe('Ticket invoice', () => {
    let service: TicketService

    beforeAll(async () => {
        const module = await createTicketModuleTesting()
        service = module.get(TicketService)
    })

    it ('should create a ticket invoice', async () => {
        const ticket = await service._find({})
        console.log(ticket.serial)
        const ticketPath = await TicketQRCode.generate(ticket)

        expect(typeof ticketPath).toBe('string')
    })
})