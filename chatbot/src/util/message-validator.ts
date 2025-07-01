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

    static _isCancel(reply: string) {
        if (reply.toLowerCase() == 'cancelar') throw new ConversactionAbort()
        return false
    }

    static getCancelHint(){
        return "\n_❌ Escribe *cancelar* para finalizar la conversación._"
    }
}