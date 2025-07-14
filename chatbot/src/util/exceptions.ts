
export class ReplyNotValidException extends Error{
    constructor (){
        super('Porfavor seleccione una opcion numerica valida.')
    }
}

export class ConversactionAbort extends Error {
    constructor(){
        super('La conversaccion ha sido terminado. Puedes volver a escribir en cualquier momento.')
    }
}

export class WhatsAppGroupIdNotFound extends Error {
    constructor(){
        super('Cannot find WhatsApp group ID')
    }
}