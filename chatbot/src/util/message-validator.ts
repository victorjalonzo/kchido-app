import { ReplyNotValidException } from "./exceptions.js"

export class Validator {
    static isAgree(reply: string): boolean{
        const index = parseInt(reply)
        if (isNaN(index)) throw new ReplyNotValidException()
        if (index != 1 && index != 2)  throw new ReplyNotValidException()
        
        if (index == 1) return true
        return false
    }

    static getOption(reply: string, options?: any[]): number{
        const index = parseInt(reply)
        if (isNaN(index)) throw new ReplyNotValidException()
        
        if (!options) return index

        const option = options[index - 1]
        if (!option) throw new ReplyNotValidException()

        return option;
    }

    static getNumber(reply: string): number {
        const number = parseInt(reply)
        if (isNaN(number)) throw new Error('Porfavor escribe un numero')
        
        return number;
    }
}