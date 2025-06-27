export class TicketReservationNotFound extends Error {
    constructor(message?: string) {
        super(message ?? 'Ticket reservation not found.')
    }
}