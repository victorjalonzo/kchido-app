import { ConversactionAbort, ReplyNotValidException } from "./exceptions.js"

export class Validator {
    static isAgree(reply: string): boolean{
        Validator._isCancel(reply)

        const index = parseInt(reply)
        if (isNaN(index)) throw new ReplyNotValidException()
        if (index != 1 && index != 2)  throw new ReplyNotValidException()
        
        if (index == 1) return true
        return false
    }

    static getOption(reply: string, options?: any[]): any{
        Validator._isCancel(reply)

        const index = parseInt(reply)
        if (isNaN(index)) throw new ReplyNotValidException()
        
        if (!options) return index

        const option = options[index - 1]
        if (!option) throw new ReplyNotValidException()

        return option;
    }

    static getNumber(reply: string): number {
        Validator._isCancel(reply)

        const number = parseInt(reply)
        if (isNaN(number)) throw new Error('Porfavor escribe un numero')
        
        return number;
    }

    static getTicketNumber(reply: string): number {
        Validator._isCancel(reply)

        const number = parseInt(reply)
        if (isNaN(number)) {
            throw new Error('Por favor, escribe un valor numérico de 6 dígitos.')
        }
    
        const length = number.toString().length
        if (length > 6) {
            throw new Error('El número *no puede tener más de 6 dígitos*. Escribe un valor numérico de 6 dígitos.')
        }
    
        if (length < 6) {
            throw new Error('El número *no puede tener menos de 6 dígitos*. Escribe un valor numérico de 6 dígitos.')
        }
    
        return number
    }

    static _isCancel(reply: string) {
        if (reply.toLowerCase() == 'cancelar') throw new ConversactionAbort()
        return false
    }

    static getCancelHint(){
        return "\n_❌ Escribe *cancelar* para finalizar la conversación._"
    }
}