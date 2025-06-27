export class TaskNotFoundException extends Error {
    constructor(){
        super('Task not found')
    }
}

export class RaffleHasNoParticipantsException extends Error {
    constructor() {
        super('Raffle has no participants');
    }
}