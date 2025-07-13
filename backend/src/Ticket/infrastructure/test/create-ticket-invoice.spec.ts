import { TicketService } from "src/Ticket/application/ticket.service"
import { createTicketModuleTesting } from "./create-ticket-testing-module"
import { TicketQRCode } from "../util/ticket.qrcode"
import { Ticket } from "src/Ticket/domain/ticket.entity"

describe('Ticket invoice', () => {
    let service: TicketService

    beforeAll(async () => {
        const module = await createTicketModuleTesting()
        service = module.get(TicketService)
    })

    it ('should create a ticket invoice', async () => {
        const ticket = <Ticket>await service._find({id: "14a0fd79-a37b-4b86-8772-e13c3fe252ed"})
        console.log(ticket.serial)
        const ticketPath = await TicketQRCode.generate(ticket)

        expect(typeof ticketPath).toBe('string')
    })
})