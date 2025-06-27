export class SubTaskNotFoundException extends Error {
    constructor(){
        super('Subtask not found')
    }
}

export class SubTasksIncompleteException extends Error {
    constructor(){
        super('Subtasks are incomplete')
    }
}