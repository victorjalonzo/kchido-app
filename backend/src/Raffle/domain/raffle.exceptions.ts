export class RaffleNotFoundException extends Error {
    constructor () {
        super('Raffle not found.')
    }
}